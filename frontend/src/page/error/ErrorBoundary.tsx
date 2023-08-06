import React, { Component, ErrorInfo, ReactNode } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { NODE_ENV } from 'config/constants.config';

interface ErrorBoundaryProps {
  fallback?: ReactNode; // 에러 페이지 컴포넌트 (optional)
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 4rem;
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  background-color: #f9f9f9;
  font-size: 2rem;
`;

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error) {
    // 에러가 발생하면 상태 업데이트
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    const { hasError, error, errorInfo } = this.state;
    if (hasError) {
      return (
        <CenteredContainer>
          <ErrorMessage>
            <h1 style={{ marginBottom: "1rem" }}>예기치 못한 오류가 발생하였습니다.</h1>
            <p style={{ marginBottom: "1rem" }}>새로고침 또는 조금만 뒤에 다시 시도해주세요.</p>
            {/* Additional error information */}
            {NODE_ENV === "development" && error && <p>Error: {error.message}</p>}
            {NODE_ENV === "development" && errorInfo && (
              <pre style={{
                textAlign: "left",
                backgroundColor: "#f5f5f5",
                padding: "1rem"
              }}>
                {errorInfo.componentStack}
              </pre>
            )}
          </ErrorMessage>
        </CenteredContainer>
      );
    }
    return this.props.children; // 에러가 없으면 자식 컴포넌트를 렌더링
  }
}

export default ErrorBoundary;
