import React from 'react';
import { BasicTextEditor } from './BasicTextEditor';
import { ContentType, TextAlignment } from './BasicTextEditor.models';

export const BasicTextEditorExample = () => {
  const [value, setValue] = React.useState('');

  const onChange = (formattedValue: any, unFormattedValue?: string) => {
    console.log(formattedValue);
    console.log(unFormattedValue);
  };

  const renderActionButtons = () => {
    return (
      <>
        <button>B</button>
        <button>I</button>
      </>
    );
  };

  return (
    <BasicTextEditor
      contentType={ContentType.Html}
      value={''}
      onChange={onChange}
      textAlignment={TextAlignment.Left}
      // renderActionButtons={renderActionButtons}
      //readOnly={true}
    />
  );
};
