import React, {ChangeEvent} from 'react';
import './App.scss';
import {createFormGenerator, useFormState} from './pkgs';
import {isNumber} from './pkgs/useFormGenerator/utils';

enum FormGenType {
  INPUT = 'input',
  BTN_INCREMENT = 'btn-increment',
  BTN_DECREMENT = 'btn-decrement'
}

const BtnIncrement = ({
  formGeneratorProps: {
    onChange,
  },
  renderProps: {
    className,
    text,
  },
}) => {
  const handleIncrement = () => onChange((prev) => isNumber(prev) ? prev + 1 : 0);
  return <button onClick={handleIncrement} className={className}>{text}</button>;
};

const BtnDecrement = ({
  formGeneratorProps: {
    onChange,
  },
  renderProps: {
    className,
    text,
  },
}) => {
  const handleIncrement = () => onChange((prev) => isNumber(prev) ? prev - 1 : 0);
  return <button onClick={handleIncrement} className={className}>{text}</button>;
};

const Input = ({
  formGeneratorProps: {
    onChange,
  },
  renderProps,
}) => {
  const handleChange = ({target}: ChangeEvent<HTMLInputElement>) => onChange(target.value);
  return <input onChange={handleChange} className={renderProps.className}/>;
};

const formItems = {
  [FormGenType.INPUT]: Input,
  [FormGenType.BTN_DECREMENT]: BtnDecrement,
  [FormGenType.BTN_INCREMENT]: BtnIncrement,
};

const scheme = [
  {
    type: FormGenType.INPUT,
    keys: ['data', 'user', 'name'],
    formItemName: 'inputName',
  },
  {
    type: FormGenType.INPUT,
    keys: ['data', 'user', 'age'],
    formItemName: 'inputAge',
  },
  {
    type: FormGenType.BTN_INCREMENT,
    keys: ['data', 'other', 'childrenCount'],
    formItemName: 'childIncrement',
  },
  {
    type: FormGenType.BTN_DECREMENT,
    keys: ['data', 'other', 'childrenCount'],
    formItemName: 'childrenDecrement',
  },
];

const useFormGenerator = createFormGenerator(formItems);

function App() {
  const [state, setState] = useFormState<any>();
  const {formItems} = useFormGenerator({
    formData: state,
    setFormData: setState,
    scheme,
  });

  return (
    <div className="App">
      <h2>Представление формы</h2>
      <form>
        <label>Имя: {formItems.inputName({className: 'input-name'})}</label>
        <label>Возраст: {formItems.inputAge({className: 'input-age'})}</label>
        <span>Количество детей: {state?.data?.other?.childrenCount}</span>
        {formItems.childIncrement()}{formItems.childrenDecrement()}
      </form>
      <textarea value={JSON.stringify(state, null, 2)} />
    </div>
  );
}

export default App;
