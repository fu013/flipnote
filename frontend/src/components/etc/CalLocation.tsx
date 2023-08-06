import React, { useState } from "react";
import ExcelUploader from "./excelUploader";
import axios from "axios";
import { SERVER_URL } from "config/constants.config";
import styled from '@emotion/styled';
import customToast from "lib/customToast";

const JSONContainer = styled.pre`
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
  overflow: auto;
  max-height: 50rem;
  font-size: 1.75rem;
  user-select: text;
  cursor: text;
`;

const CopyButton = styled.button`
  margin-top: 10px;
  background-color: #0134ef;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 2rem;
  cursor: pointer;
`;

const DownloadButton = styled.button`
  margin-top: 10px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 2rem;
  cursor: pointer;
  margin-left: 10px;
`;

const JSONViewerButton = styled.a`
  margin-top: 10px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 2rem;
  cursor: pointer;
  margin-left: 10px;
  text-decoration: none;
`;

const CalLocation: React.FC = () => {
  const [result, setResult] = useState<string>("");

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${SERVER_URL}/excel/upload`, formData);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('파일 업로드 및 처리 중 오류 발생:', error);
    }
  };

  const handleCopyClick = () => {
    if (result) {
      // 데이터가 있을 경우 클립보드에 복사
      navigator.clipboard.writeText(result);
      customToast('전체 복사되었습니다.', "success");
    }
  };

  const handleDownloadClick = () => {
    if (result) {
      // JSON 데이터를 파일로 다운로드
      const blob = new Blob([result], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleJSONViewerClick = () => {
    if (result) {
      const jsonViewerUrl = `https://codebeautify.org/jsonviewer`;
      window.open(jsonViewerUrl, '_blank');
    }
  };
  const handleAddressViewerClick = () => {
    const jsonViewerUrl = `https://www.kraddress.com`;
    window.open(jsonViewerUrl, '_blank');
  };

  return (
    <section style={{ textAlign: "center" }}>
      <h3
        style={{
          paddingLeft: "0.5rem",
          marginTop: "1rem",
          marginBottom: "2rem",
          fontSize: "2.5rem",
        }}
      >
        JSON 파일 자동으로 수정 Component
      </h3>
      <ExcelUploader onFileUpload={handleFileUpload} />
      <JSONContainer>
        {result}
      </JSONContainer>
      <CopyButton onClick={handleCopyClick}>전체 복사</CopyButton>
      <DownloadButton onClick={handleDownloadClick}>JSON 파일 다운로드</DownloadButton>
      <JSONViewerButton onClick={handleJSONViewerClick}>JSONViewer 열기</JSONViewerButton>
      <JSONViewerButton onClick={handleAddressViewerClick}>영문 주소 변환기 열기</JSONViewerButton>
    </section>
  );
};

export default CalLocation;
