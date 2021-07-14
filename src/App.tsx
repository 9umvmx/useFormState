import React from 'react';
import './App.scss';
import {createFormGenerator, useFormState} from './pkgs';

enum FormGenType {
  SELECT = 'select',
  INPUT = 'input'
}

const useFormGenerator = createFormGenerator({
  [FormGenType.SELECT]: ({
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
  [FormGenType.INPUT]: () => <div>input</div>,

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
  {
    type: FormGenType.SELECT,
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
      <div>state: {JSON.stringify(state, null, '\t')}</div>
      <textarea value={JSON.stringify(state, null, 2)} />
    </div>
  );
}

export default App;
