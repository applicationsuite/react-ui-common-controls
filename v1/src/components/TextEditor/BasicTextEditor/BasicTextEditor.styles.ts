export const basicTextEditorStyles = (theme: string) => ({
  basicEditorRoot: {
    background: '#fff',
    border: '1px solid #ddd',
    fontFamily: "'Georgia', serif",
    fontSize: '14px',
    padding: '15px'
  },
  basicEditor: {
    borderTop: '1px solid #ddd',
    cursor: 'text',
    fontSize: '16px',
    marginTop: '10px',

    '& .public-DraftEditorPlaceholder-root': {
      margin: '0 -15px -15px',
      padding: '15px'
    },

    '& .public-DraftEditor-content': {
      margin: '0 -15px -15px',
      padding: '15px',
      minHeight: '100px'
    },

    '& .public-DraftStyleDefault-pre': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      fontFamily: "'Inconsolata', 'Menlo', 'Consolas', monospace",
      fontSize: '16px',
      padding: '20px'
    }
  },
  basicEditorHidePlaceHolder: {
    '& .public-DraftEditorPlaceholder-root': {
      display: 'none'
    }
  },
  basicEditorBlockQuote: {
    borderLeft: '5px solid #eee',
    color: '#666',
    fontFamily: "'Hoefler Text', 'Georgia', serif",
    fontStyle: 'italic',
    margin: '16px 0',
    padding: '10px 20px'
  },
  basicEditorControls: {
    fontFamily: "'Helvetica', sans-serif",
    fontSize: '14px',
    marginBottom: '5px',
    userSelect: 'none'
  },
  basicEditorButtons: {
    color: '#999',
    cursor: 'pointer',
    marginRight: '16px',
    padding: '2px 0',
    display: 'inline-block'
  },
  basicEditorButtonsActive: {
    color: '#5890ff',
    fontWeight: 'bold'
  }
});
