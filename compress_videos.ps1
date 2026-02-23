# Compress all portfolio videos for Cloudinary upload
# Target: 720p, H.264, CRF 28 (good quality, small file size)

$ffmpeg = "ffmpeg"
$outputDir = "d:\Work\usaid\compressed"

# Define all videos to compress
$videos = @(
    @{ Input = "d:\Work\usaid\main.mp4"; Output = "$outputDir\main.mp4" },
    @{ Input = "d:\Work\usaid\main parallax.mp4"; Output = "$outputDir\main_parallax.mp4" },
    @{ Input = "d:\Work\usaid\shorts\shorts.mp4"; Output = "$outputDir\shorts.mp4" },
    @{ Input = "d:\Work\usaid\shorts\9x16 1.mp4"; Output = "$outputDir\9x16_1.mp4" },
    @{ Input = "d:\Work\usaid\shorts\motion\Comp 1.mp4"; Output = "$outputDir\comp_1.mp4" },
    @{ Input = "d:\Work\usaid\shorts\motion\Comp 2.mp4"; Output = "$outputDir\comp_2.mp4" },
    @{ Input = "d:\Work\usaid\talking head\Talking head.mp4"; Output = "$outputDir\talking_head.mp4" },
    @{ Input = "d:\Work\usaid\talking head\vsl.mp4"; Output = "$outputDir\vsl.mp4" },
    @{ Input = "d:\Work\usaid\talking head\Batch 200_v1_9x16.mp4"; Output = "$outputDir\batch_200.mp4" },
    @{ Input = "d:\Work\usaid\real estate\real estate.mp4"; Output = "$outputDir\real_estate.mp4" },
    @{ Input = "d:\Work\usaid\real estate\v3.mp4"; Output = "$outputDir\v3.mp4" },
    @{ Input = "d:\Work\usaid\real estate\29th June v2.mp4"; Output = "$outputDir\29th_june_v2.mp4" },
    @{ Input = "d:\Work\usaid\podcast\Body 1.mp4"; Output = "$outputDir\body_1.mp4" }
)

$total = $videos.Count
$current = 0

foreach ($video in $videos) {
    $current++
    $inputFile = $video.Input
    $outputFile = $video.Output
    $fileName = Split-Path $inputFile -Leaf
    
    Write-Host "`n[$current/$total] Compressing: $fileName" -ForegroundColor Cyan
    
    # Check if input exists
    if (-not (Test-Path $inputFile)) {
        Write-Host "  SKIPPED - File not found: $inputFile" -ForegroundColor Yellow
        continue
    }
    
    # Get input file size
    $inputSize = [math]::Round((Get-Item $inputFile).Length / 1MB, 1)
    Write-Host "  Input size: ${inputSize} MB"
    
    # Compress: 720p max height, H.264, CRF 28, fast preset
    & $ffmpeg -i $inputFile -vf "scale=-2:min(720\,ih)" -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 128k -movflags +faststart -y $outputFile 2>&1 | Out-Null
    
    if (Test-Path $outputFile) {
        $outputSize = [math]::Round((Get-Item $outputFile).Length / 1MB, 1)
        $reduction = [math]::Round((1 - $outputSize / $inputSize) * 100, 0)
        Write-Host "  Output size: ${outputSize} MB (${reduction}% smaller)" -ForegroundColor Green
    } else {
        Write-Host "  ERROR - Compression failed!" -ForegroundColor Red
    }
}

Write-Host "`n=== COMPRESSION COMPLETE ===" -ForegroundColor Green
Write-Host "Compressed files are in: $outputDir"

# Show final sizes
Write-Host "`nFinal file sizes:"
Get-ChildItem $outputDir -Filter *.mp4 | ForEach-Object {
    $size = [math]::Round($_.Length / 1MB, 1)
    Write-Host "  $($_.Name): ${size} MB"
}
