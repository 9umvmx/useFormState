import React from 'react';
import './App.scss';
import {createFormGenerator, useFormState} from './pkgs';

enum FormGenType {
  SELECT = 'select',
  INPUT = 'input'
}

const useFormGenerator = createFormGenerator({
  [FormGenType.SELECT]: () => <div>hi</div>,

});

const scheme = [
  {
    type: FormGenType.SELECT,
    keys: ['response', 'data', 'name'],
    formItemName: 'name',
  },
  {
    type: FormGenType.SELECT,
    keys: ['response', 'data', 'age'],
    formItemName: 'age',
  },
];

function App() {
  const [state, setState] = useFormState<any>();
  const {formItems} = useFormGenerator({
    formData: state,
    setFormData: setState,
    scheme,
  });

  return (
    <div className="App">
    text
    </div>
  );
}

export default App;
