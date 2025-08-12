import React from 'react';

export function ErrorBoundary({ error }) {
  return (
    <div
      style={{
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1>Oops! Algo deu errado</h1>
      <p>Desculpe, ocorreu um erro inesperado.</p>
      <button
        onClick={() => window.location.reload()}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Recarregar Página
      </button>
      {error && (
        <details style={{ marginTop: '20px', textAlign: 'left' }}>
          <summary>Detalhes do Erro</summary>
          <pre
            style={{
              backgroundColor: '#f8f9fa',
              padding: '10px',
              borderRadius: '5px',
              overflow: 'auto',
            }}
          >
            {error.message}
          </pre>
        </details>
      )}
    </div>
  );
}
