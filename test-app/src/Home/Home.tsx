import React from 'react';
import './Home.css';
import { GridViewExample } from 'react-ui-common-controls/lib/components/GridView/GridView.example';

export const Home = () => {
  const [component, setComponent] = React.useState('');
  const controls: any[] = [
    {
      name: 'GridView',
      component: () => <GridViewExample />
    },
    {
      name: 'FileUpload',
      component: () => <>FileUpload Control</>
    }
  ];

  const onControlClick = (control: string) => {
    setComponent(control);
  };

  const selectedComponent = controls.find((item) => item.name === component);
  const ComponentToRender = selectedComponent && selectedComponent.component;

  return (
    <main className="container">
      {
        <div className="my-3 p-3 bg-body rounded shadow-sm">
          <h6 className="border-bottom pb-2 mb-0"> Controls</h6>
          <div className="d-flex text-muted pt-3">
            {controls.map((item, index) => {
              return (
                <a
                  key={index}
                  href="#"
                  onClick={() => {
                    onControlClick(item.name);
                  }}
                  className="col-md-1"
                >
                  {item.name}
                </a>
              );
            })}
          </div>
        </div>
      }
      {ComponentToRender && (
        <div className="my-3 p-3 bg-body rounded shadow-sm">
          <h6 className="border-bottom pb-2 mb-0"> {component} </h6>
          <div className="d-flex text-muted pt-3">
            <div className="col-md-12">{ComponentToRender && <ComponentToRender />}</div>
          </div>
        </div>
      )}
    </main>
  );
};
