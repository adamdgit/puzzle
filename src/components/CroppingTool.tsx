import { useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop"


export default function CroppingTool({ setCroppedImage, BOARDSIZE } : {
    setCroppedImage: React.Dispatch<React.SetStateAction<HTMLCanvasElement | null>>,
    BOARDSIZE: number
}) {
    const imageUploadEl = useRef<HTMLInputElement>(null);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null); // base64url string
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [croppedPixels, setCroppedPixels] = useState<Area | null>(null);

    // get user uploaded image and display on page, to be re-sized
    function handle_file_upload() {
        const file = imageUploadEl.current?.files?.[0];

        if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onload = (event) => {
            const dataimgurl = event.target?.result;
            if (typeof dataimgurl === "string") {
            setUploadedFile(dataimgurl)
            }
        }
        }
    };

    // crops the image to prepare for game start
    function handle_crop() {
        if (!uploadedFile || !croppedAreaPixels || !croppedPixels) {
            // setError("You must upload an image before starting the game")
            return
        }

        const image = new Image();
        image.src = uploadedFile;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = BOARDSIZE;
            canvas.height = BOARDSIZE;

            if (!ctx) return // handle error msg?

            ctx.drawImage(
                image,
                croppedPixels.x,
                croppedPixels.y,
                croppedPixels.width,
                croppedPixels.height,
                0,
                0,
                BOARDSIZE,
                BOARDSIZE
            );

            setCroppedImage(canvas);
        };
    }

  return (
    <>
        <p>Upload an Image to play with, crop it to your liking.</p>
        <input type='file' accept='image/png, image/jpeg' 
        onChange={() => handle_file_upload()}
        ref={imageUploadEl}
        />
        <div style={{ position: 'relative', width: BOARDSIZE, height: BOARDSIZE }}>
        {uploadedFile && (
            <Cropper
                showGrid={false}
                image={uploadedFile}
                crop={crop}
                zoom={zoom}
                aspect={1} // square
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(croppedArea, croppedPixels) => {
                    setCroppedAreaPixels(croppedArea)
                    setCroppedPixels(croppedPixels)
                }}
            />
        )}
        <button className='play-btn' onClick={() => handle_crop()}>Play Game!</button>
        </div>
    </>
  )
}
