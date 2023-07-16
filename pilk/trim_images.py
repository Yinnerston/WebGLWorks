import os
import sys
import cv2
def trim_image(im):
    """
    Outputs 210x220 image centered on neco arc
    """
    trimmed_image = im[471:699, 380:600]
    return trimmed_image
    

# neco_arc_long = imread("assets/133_404_001.bmp.png")
# neco_arc_tall = imread("assets/212_601_001.bmp.png")
# trim_image(neco_arc_long)
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
        im = cv2.imread(bmppng)
        trimmed_im = trim_image(im)
        cv2.imwrite(os.path.join(output_dir, filename), trimmed_im)

