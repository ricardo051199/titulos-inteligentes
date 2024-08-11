"use client";

import { useState } from "react";
import { Button, Input, Upload, Form, message } from "antd";
import { ethers } from "ethers";
import { UploadOutlined } from "@ant-design/icons";


interface VerificationFormProps {
  contract: ethers.Contract;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ contract }) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [form] = Form.useForm();

  const handleFileUpload = (info: any) => {
    if (info.file.status === "done") {
      setPdfFile(info.file.originFileObj);
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const verifyCertificate = async () => {
    try {
      const values = await form.validateFields();
      const { tokenId, userAddress } = values;

      const certified = await contract.verifyCertificate(tokenId);
      if (certified) {
        message.success("Verification successful! Certificate is valid.");
      } else {
        message.error("Verification failed! Certificate is invalid.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      message.error("An error occurred during verification.");
    }
  };

  return (
    <div className="verification-container">
      <h2>Upload Certificate PDF</h2>
      <Upload
        accept=".pdf"
        showUploadList={false}
        beforeUpload={() => false}
        onChange={handleFileUpload}
      >
        <Button icon={<UploadOutlined />}>Click to Upload PDF</Button>
      </Upload>

      {pdfFile && (
        <div className="pdf-preview">
          <h3>PDF Preview: {pdfFile.name}</h3>
          {/* You can use a library like react-pdf to display the PDF */}
        </div>
      )}

      <Form form={form} layout="vertical" className="verification-form">
        <Form.Item
          name="tokenId"
          label="Token ID"
          rules={[{ required: true, message: "Please input the Token ID!" }]}
        >
          <Input placeholder="Enter Token ID" />
        </Form.Item>

        <Form.Item
          name="userAddress"
          label="User Address"
          rules={[{ required: true, message: "Please input the User Address!" }]}
        >
          <Input placeholder="Enter User Address" />
        </Form.Item>

        <Button type="primary" onClick={verifyCertificate}>
          Verify Certificate
        </Button>
      </Form>
    </div>
  );
};

export default VerificationForm;
