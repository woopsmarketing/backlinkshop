import os
from PIL import Image


def optimize_image(input_path, output_path, target_size=None, crop_ratio=None):
    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        return

    try:
        with Image.open(input_path) as img:
            # Convert to RGB if necessary
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            width, height = img.size

            # Calculate crop box
            if crop_ratio:
                target_ratio = crop_ratio
                current_ratio = width / height

                if current_ratio > target_ratio:
                    # Too wide, crop width
                    new_width = int(height * target_ratio)
                    left = (width - new_width) // 2
                    top = 0
                    right = left + new_width
                    bottom = height
                else:
                    # Too tall, crop height
                    new_height = int(width / target_ratio)
                    left = 0
                    top = (height - new_height) // 2
                    right = width
                    bottom = top + new_height

                img = img.crop((left, top, right, bottom))

            # Resize if target_size is provided
            if target_size:
                img = img.resize(target_size, Image.Resampling.LANCZOS)

            # Save optimized
            img.save(output_path, "PNG", optimize=True)
            print(f"Saved optimized image to {output_path}")

    except Exception as e:
        print(f"Error processing {input_path}: {e}")


# Process Logo (Square 1:1, 512x512)
optimize_image(
    "public/logo.png", "public/logo.png", target_size=(512, 512), crop_ratio=1.0
)

# Process Campaign 1 (Landscape 1.91:1, 1200x628)
optimize_image(
    "public/campaign-1.png",
    "public/campaign-1.png",
    target_size=(1200, 628),
    crop_ratio=1.91,
)

# Process Campaign 2 (Landscape 1.91:1, 1200x628)
optimize_image(
    "public/campaign-2.png",
    "public/campaign-2.png",
    target_size=(1200, 628),
    crop_ratio=1.91,
)
