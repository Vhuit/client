import React, { useEffect, useState } from "react";
import { Form, Button } from 'react-bootstrap';
import { Buffer } from 'buffer';
import axios from 'axios';

// Xử lý dữ liệu và truyền vào DB
function AddBlob() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [fileDescription, setFileDescription] = useState("");
    const [fileType, setFileType] = useState("");
    const [fileSize, setFileSize] = useState(0);
    const [fileWidth, setFileWidth] = useState(0);
    const [fileHeight, setFileHeight] = useState(0);
    const [fileLength, setFileLength] = useState(0);
    const [fileData, setFileData] = useState(null);
    const [fileVersion, setFileVersion] = useState(1);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
        setFileName(file.name);
        setFileType(file.type);
        setFileSize(file.size);


        // Encode file data
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = async (event) => {
            const escapedData = Buffer.from(event.target.result).toString('base64');
            setFileData(escapedData);
        }
        if (file.type.includes("image")) {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                setFileWidth(img.width);
                setFileHeight(img.height);
            }
        } else if (file.type.includes("audio")) {
            const audio = new Audio();
            audio.src = URL.createObjectURL(file);
            audio.onloadedmetadata = () => {
                setFileLength(audio.duration);
            }
        }
        else if (file.type.includes("video")) {
            const video = document.createElement("video");
            video.src = URL.createObjectURL(file);
            video.onloadedmetadata = () => {
                setFileLength(video.duration);
            }
        }
    }

    const [url, setUrl] = useState("");

    const handleSubmitClick = async () => {
        try {
            const metadata = {
                "mime_type": fileType,
                "filename": fileName,
                "size": fileSize,
                "height": fileHeight,
                "width": fileWidth,
                "length": fileLength,
                "description": fileDescription,
                "version": fileVersion
            }
            const response = await axios.post("http://localhost:3001/metadata", metadata);
            if (response.status !== 201) {
                console.error("Failed to create metadata.");
                return;
            }
            const metadataId = response.data;
            const blob = {
                "metadata_id": metadataId,
                "bytea": fileData
            }
            console.log(blob);
            const blobres = await axios.post("http://localhost:3001/blob", blob);
            if (blobres.status !== 201) {
                console.error("Failed to create blob.");
                return;
            }
            const decodedData = `data:${fileType};base64,${fileData}`;
            setUrl(decodedData);
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <div>
            <div className="container my-3">
                <h2>Thêm Blob</h2>
                <Form>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Chọn file</Form.Label>
                        <Form.Control type="file" onChange={(e) => handleFileChange(e)} />
                    </Form.Group>
                    <Form.Group controlId="formFileName" className="mb-3">
                        <Form.Label>Tên file</Form.Label>
                        <Form.Control type="text" placeholder="Nhập tên file" name="fname" defaultValue={fileName} onChange={(e) => setFileName(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formFileDescription" className="mb-3">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control type="text" placeholder="Nhập mô tả" name="fdesc" defaultValue={fileDescription} onChange={(e) => setFileDescription(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formFileVersion" className="mb-3">
                        <Form.Label>Phiên bản</Form.Label>
                        <Form.Control type="number" placeholder="Nhập phiên bản" name="fversion" defaultValue={fileVersion} onChange={(e) => setFileVersion(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" onClick={handleSubmitClick}>
                        Submit
                    </Button>
                </Form>
                <div>
                    <img src={url} />
                </div>
            </div>
        </div>
    )
}

export default AddBlob;
