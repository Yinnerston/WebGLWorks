import os
import sys
import cv2
import numpy as np

def trim_image(im):
    """
    Outputs 210x220 image centered on neco arc
    """
    trimmed_image = im[471:699, 380:600]
    return trimmed_image
    
def remove_greenscreen(im):
    """
    Filter greenscreen to make alpha channel 0 for greenscreen pixels
    """
    rgba_im = cv2.cvtColor(im, cv2.COLOR_RGB2RGBA)
    green_colour = np.array([0, 255, 0, 255])
    mask = cv2.inRange(rgba_im, green_colour, green_colour)
    result = cv2.bitwise_and(rgba_im, rgba_im, mask = cv2.bitwise_not(mask))
    return result


# neco_arc_long = cv2.imread("assets/133_404_001.bmp.png", flags=cv2.IMREAD_UNCHANGED)
# trimmed_neco_arc_long = trim_image(neco_arc_long)
# neco_arc_long_out = remove_greenscreen(trimmed_neco_arc_long)
# cv2.imwrite(os.path.join("output", "neco_arc_long.png"), neco_arc_long_out)

# neco_arc_tall = cv2.imread("assets/212_601_001.bmp.png", flags=cv2.IMREAD_UNCHANGED)
# trim_image(neco_arc_tall)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise Exception("Takes the neco arc .bmp.png directory as input and output directory as output. In the form python trim_images.py INPUT OUTPUT")
    neco_arc_dir = sys.argv[1]
    output_dir = sys.argv[2]

    if not os.path.exists(neco_arc_dir):
        raise Exception("Give a valid input directory")
    
    neco_arc_bmp_png_files = [(os.path.join(neco_arc_dir, bmppng), bmppng) for bmppng in os.listdir(neco_arc_dir) if bmppng.endswith(".bmp.png")]
    for bmppng, filename in neco_arc_bmp_png_files:
        im = cv2.imread(bmppng, flags=cv2.IMREAD_UNCHANGED)
        trimmed_im = trim_image(im)
        greenscreen_removed_im = remove_greenscreen(trimmed_im)
        cv2.imwrite(os.path.join(output_dir, filename), greenscreen_removed_im)

