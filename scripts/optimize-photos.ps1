# =============================================================================
#  optimize-photos.ps1  —  prep the memory-wall photos for the web
# =============================================================================
#  Reads every image in .\Photos, fixes EXIF rotation, downscales so the long
#  edge is <= $MaxEdge, re-encodes as JPEG at $Quality, and writes them as
#  photo-01.jpg, photo-02.jpg, ... into .\public\photos (what the site serves).
#
#  It ALSO writes a tiny thumb-01.jpg, thumb-02.jpg, ... (long edge <= $ThumbEdge)
#  for the drifting memory wall, where the prints are only ~100px wide. The wall
#  loads these (≈1 MB total instead of ≈12 MB — a big win on phones/cellular);
#  the full-size photo-NN.jpg is fetched only when a photo is opened full-screen.
#
#  Re-run this any time you add/replace photos in .\Photos, then the showcase
#  picks them up (the count is wired into src/config/content.ts).
# =============================================================================

param(
  [string]$Source     = ".\Photos",
  [string]$Dest       = ".\public\photos",
  [int]$MaxEdge       = 1920,
  [int]$Quality       = 82,
  [int]$ThumbEdge     = 480,
  [int]$ThumbQuality  = 78
)

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path $Dest)) { New-Item -ItemType Directory -Path $Dest | Out-Null }

# Clear any previously generated photo-*.jpg / thumb-*.jpg so removals/reorders take effect.
Get-ChildItem -Path $Dest -File -Filter "photo-*.jpg" -ErrorAction SilentlyContinue | Remove-Item -Force
Get-ChildItem -Path $Dest -File -Filter "thumb-*.jpg" -ErrorAction SilentlyContinue | Remove-Item -Force

$files = Get-ChildItem -Path $Source -File |
  Where-Object { $_.Extension -match '^\.(jpg|jpeg|png)$' } |
  Sort-Object Name

# Grab the JPEG codec + a quality encoder param once.
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' }
$qualityParam = New-Object System.Drawing.Imaging.EncoderParameters(1)
$qualityParam.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)

$thumbQualityParam = New-Object System.Drawing.Imaging.EncoderParameters(1)
$thumbQualityParam.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, [long]$ThumbQuality)

# Render an upright source image down to a target long edge and save it as JPEG.
function Save-Scaled {
  param($SrcImg, [int]$MaxLongEdge, [string]$OutPath, $Codec, $EncParams)
  $w = $SrcImg.Width; $h = $SrcImg.Height
  $scale = [math]::Min(1.0, $MaxLongEdge / [math]::Max($w, $h))
  $nw = [int][math]::Round($w * $scale)
  $nh = [int][math]::Round($h * $scale)
  $bmp = New-Object System.Drawing.Bitmap($nw, $nh)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($SrcImg, 0, 0, $nw, $nh)
  $bmp.Save($OutPath, $Codec, $EncParams)
  $g.Dispose(); $bmp.Dispose()
  return @{ w = $nw; h = $nh }
}

# EXIF orientation (tag 0x0112) -> how to rotate so the photo sits upright.
$rotations = @{
  3 = [System.Drawing.RotateFlipType]::Rotate180FlipNone
  6 = [System.Drawing.RotateFlipType]::Rotate90FlipNone
  8 = [System.Drawing.RotateFlipType]::Rotate270FlipNone
}

$i = 0
foreach ($f in $files) {
  $i++
  $img = [System.Drawing.Image]::FromFile($f.FullName)
  try {
    # 1. Respect EXIF orientation from phone cameras.
    if ($img.PropertyIdList -contains 0x0112) {
      $o = $img.GetPropertyItem(0x0112).Value[0]
      if ($rotations.ContainsKey([int]$o)) {
        $img.RotateFlip($rotations[[int]$o])
      }
    }

    # 2. Full-size print (long edge <= $MaxEdge) — used in the full-screen view.
    $out  = Join-Path $Dest ("photo-{0:D2}.jpg" -f $i)
    $dim  = Save-Scaled $img $MaxEdge $out $jpegCodec $qualityParam

    # 3. Tiny thumbnail (long edge <= $ThumbEdge) — used in the drifting wall.
    $tout = Join-Path $Dest ("thumb-{0:D2}.jpg" -f $i)
    $tdim = Save-Scaled $img $ThumbEdge $tout $jpegCodec $thumbQualityParam

    $kb  = [math]::Round((Get-Item $out).Length / 1KB)
    $tkb = [math]::Round((Get-Item $tout).Length / 1KB)
    Write-Host ("photo-{0:D2}.jpg  {1}x{2}  {3} KB   (thumb {4}x{5}  {6} KB)   <- {7}" -f `
      $i, $dim.w, $dim.h, $kb, $tdim.w, $tdim.h, $tkb, $f.Name)
  }
  finally {
    $img.Dispose()
  }
}

Write-Host ""
Write-Host ("Done. $i photos (+ $i thumbnails) written to $Dest")
$sum  = [math]::Round((Get-ChildItem $Dest -Filter 'photo-*.jpg' | Measure-Object Length -Sum).Sum / 1MB, 1)
$tsum = [math]::Round((Get-ChildItem $Dest -Filter 'thumb-*.jpg' | Measure-Object Length -Sum).Sum / 1MB, 2)
Write-Host ("Full-size total: $sum MB   ·   thumbnail total (what the wall loads): $tsum MB")
