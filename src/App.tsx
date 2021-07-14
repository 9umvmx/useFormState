import React, {useState} from 'react';
import './App.scss';
import {createFormGenerator, useFormState} from './pkgs';

enum FormGenType {
  SELECT = 'select',
  INPUT = 'input',
  BUTTON = 'button'
}

const Button = ({
  schemeProps: {formItemName},
  formGeneratorProps: {
    onChange,
    data,
  },
}) => {
  const [state, setState] = useState(0);

  return (
    <label>
    count {state}
      <button onClick={() => setState((prev) => ++prev)}>{formItemName}</button>
    </label>
  );
};

const formItems = {
  [FormGenType.INPUT]: ({
    schemeProps: {formItemName},
    formGeneratorProps: {
      onChange,
      data,
    },
  }) => (
    <label>{formItemName}
      <input onChange={({target}) => onChange(target.value)} value={data}/>
    </label>
  ),
  [FormGenType.BUTTON]: Button,

};

const useFormGenerator = createFormGenerator(formItems);

const scheme = [
  {
    type: FormGenType.INPUT,
    keys: ['response', 'data', 'name'],
    formItemName: 'name',
  },
  {
    type: FormGenType.INPUT,
    keys: ['response', 'data', 'age'],
    formItemName: 'age',
  },
  {
    type: FormGenType.BUTTON,
    keys: ['response', 'select', 'car'],
    formItemName: 'car',
  },
  {
    type: FormGenType.INPUT,
    keys: ['data'],
    formItemName: 'data',
  },
];

function App() {
  const [state, setState] = useFormState<any>();
  const {formItems} = useFormGenerator({
    formData: state,
    setFormData: setState,
    scheme,
  });

  console.log({state});

  return (
    <div className="App">
      {formItems.age()}
      {formItems.name()}
      {formItems.data()}
      {formItems.car()}
      <div>state: {JSON.stringify(state, null, '  ')}</div>
      <textarea value={JSON.stringify(state, null, 2)} />
    </div>
  );
}

export default App;
