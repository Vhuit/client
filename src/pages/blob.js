import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Buffer } from "buffer";
import { Card } from "react-bootstrap";

function Blob() {
    const [metadata, setMetadata] = useState([]);
    const [blob, setBlob] = useState([]);
    const [completeBlob, setCompleteBlob] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(`https://testapp-vhuit-4f3e49a727b6.herokuapp.com/metadata`);
            setMetadata(result.data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(`https://testapp-vhuit-4f3e49a727b6.herokuapp.com/blob`);
            setBlob(result.data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const joinData = async () => {
            const joinedData = metadata.map((meta) => {
                const blobData = blob.find((blob) => blob.metadata_id === meta.id);

                return {
                    ...meta,
                    blob: `data:${meta.mime_type};base64,${Buffer.from(blobData.bytea, 'base64').toString()}` // giải mã từ base64 binary sang dạng chuỗi có thể được hiển thị bởi các HTML tags
                }
            });

            setCompleteBlob(joinedData);

        }
        if (metadata.length && blob.length) {
            joinData();
        }
    }, [metadata, blob]);

    return (
        <div className="container">
            <h1>BLOBs</h1>
            <div className="row">
                {completeBlob.map((data) => (
                    <div className="col-10 mx-auto" key={data.id}>
                        <Card className="mb-3">
                            <Card.Header>

                                {
                                    data.mime_type.includes("image") ?
                                        <img src={data.blob} alt={data.filename} className="col-11" /> : null
                                }
                                {
                                    data.mime_type.includes("audio") ?
                                        <audio src={data.blob} controls className="col-11" /> : null
                                }
                                {
                                    data.mime_type.includes("video") ?
                                        <video src={data.blob} controls className="col-11" /> : null
                                }
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>File Name: {data.filename}</Card.Title>
                                <Card.Text className="text-wrap">
                                    <span className="fw-bold">Description: </span>
                                    {data.description}

                                </Card.Text>
                                <div className="row">
                                    <div className="col-6">
                                        <div className="row">
                                            <div className="col-6 text-end">
                                                Data Type:
                                            </div>
                                            <div className="col-6 text-start">
                                                {data.mime_type}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="row">
                                            <div className="col-6 text-end">
                                                Size:
                                            </div>
                                            <div className="col-6 text-start">
                                                {
                                                    data.size < 1024 ? `${data.size} B` :
                                                        data.size < 1024 * 1024 ? `${(data.size / 1024).toFixed(2)} KB` :
                                                            data.size < 1024 * 1024 * 1024 ? `${(data.size / (1024 * 1024)).toFixed(2)} MB` :
                                                                `${(data.size / (1024 * 1024 * 1024)).toFixed(2)} GB`
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );

}

export default Blob;