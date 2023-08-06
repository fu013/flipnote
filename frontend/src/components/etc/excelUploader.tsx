import React, { useCallback, useState } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import styled from '@emotion/styled';

interface ExcelUploaderProps {
  onFileUpload: (file: File) => void;
}

const DropzoneContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  min-height: 200px;
  font-size: 18px;
  color: #555;
`;

const FilePreview = styled.div`
  margin-top: 20px;
`;

const ExcelUploader: React.FC<ExcelUploaderProps> = ({ onFileUpload }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0];
    setUploadedFile(file);
    onFileUpload(file);
  }, [onFileUpload]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <DropzoneContainer {...getRootProps()}>
      <input {...getInputProps()} />
      {uploadedFile ? (
        <FilePreview>
          <p>업로드된 파일: {uploadedFile.name}</p>
        </FilePreview>
      ) : (
        <p>클릭하거나 파일을 끌어서 업로드하세요.</p>
      )}
    </DropzoneContainer>
  );
};

export default ExcelUploader;
