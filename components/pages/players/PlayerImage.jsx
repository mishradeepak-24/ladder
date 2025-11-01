
  "use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadProfileImage,
  resetProfileImageState,
} from "@/redux/slices/profileImageSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Cropper from "react-easy-crop";
import defaultAvatar from "@/public/logo.jpg";

const PlayerImage = ({ userId, onClose = () => {} }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cropping, setCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const { loading, success, error } = useSelector(
    (state) => state.profileImage
  );

  useEffect(() => {
    return () => {
      dispatch(resetProfileImageState());
    };
  }, [dispatch]);

  // Auto-close modal after successful upload
  useEffect(() => {
    if (success) {
      // Optionally update preview immediately
      if (file) setPreview(URL.createObjectURL(file));

      // Auto-close after short delay
      const timer = setTimeout(() => {
        onClose();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [success, onClose, file]);

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setCropping(true);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async () => {
    if (!preview || !croppedAreaPixels) return null;

    const image = new window.Image();
    image.src = preview;

    await new Promise((resolve) => image.onload = resolve);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg");
    });
  };

  const handleCropSave = async () => {
    const croppedBlob = await getCroppedImg();
    if (croppedBlob) {
      const croppedFile = new File([croppedBlob], "cropped.jpg", {
        type: "image/jpeg",
      });
      setFile(croppedFile);
      setPreview(URL.createObjectURL(croppedBlob));
      setCropping(false);
    }
  };

  const handleUpload = () => {
    if (!userId || !file) return;
    dispatch(uploadProfileImage({ id: userId, image: file }));
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 space-y-4 ">
      <CardContent className="space-y-4 flex flex-col items-center">
        <label htmlFor="fileInput" className="cursor-pointer">
          <Image
            src={preview || defaultAvatar}
            alt="Selected Profile"
            width={120}
            height={120}
            className="rounded-full w-24 h-24 object-cover border-2 border-gray-300"
          />
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        {cropping && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
            <div className="relative w-[90vw] h-[60vh] bg-white rounded-xl overflow-hidden">
              <Cropper
                image={preview}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex gap-4 mt-4">
              <Button
                onClick={() => setCropping(false)}
                variant="secondary"
                className="bg-gray-500 hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCropSave}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save Crop
              </Button>
            </div>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={loading || !file || !userId}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Uploading..." : "Upload"}
        </Button>

        {success && (
          <p className="text-green-600 text-sm font-medium">
            Upload successful!
          </p>
        )}
        {error && (
          <p className="text-red-600 text-sm font-medium">
            {typeof error === "string"
              ? error
              : error.message || error.error_message || "Upload failed"}
          </p>
        )}
        {!userId && (
          <p className="text-red-500 text-sm font-semibold">
            User ID is missing.
          </p>
        )}
      </CardContent>
    </div>
  );
};

export default PlayerImage;

