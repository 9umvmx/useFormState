import React, {
  ChangeEvent,
  createElement,
  forwardRef,
  useDebugValue,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
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
  return (
    <input
      onChange={handleChange}
      required
      form="text form"
      formNoValidate
      className={renderProps.className}
    />
  );
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

const allFormItem = {
  [FormGenType.INPUT]: Input,
  [FormGenType.BTN_DECREMENT]: BtnDecrement,
  [FormGenType.BTN_INCREMENT]: BtnIncrement,
};

const useFormGenerator = createFormGenerator(allFormItem);

function App() {
  const [state, setState] = useFormState<any>();
  const {formItems} = useFormGenerator({
    formData: state,
    setFormData: setState,
    scheme,
  });

  useEffect(() => {
    const setStateC = setState.byKeys(['b', 'c']);
    setStateC(false);
    setState((prev) => ({...prev, dddd: 33}));
    setTimeout(() => {
      setStateC(false);
    }, 100);
  }, []);

  console.log({state});

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Console.log({event});
    return false;
  };

  const el = createElement('div');

  return (
    <div className="App">
      <h2>Представление формы</h2>
      <form
        onInvalid={console.log}
        onSubmit={handleSubmit}
      >
        <label className="name">Имя: {formItems.inputName({className: 'name-input'})}</label>
        <label className="age">Возраст: {formItems.inputAge({className: 'age-input'})}</label>
        <div className="count-child">
          <span className="count-child__title">Количество детей: <span>{state?.data?.other?.childrenCount}</span></span>
          {formItems.childIncrement({className: 'btn-inc', text: 'Увеличить'})}
          {formItems.childrenDecrement({className: 'btn-decrement', text: 'Уменьшить'})}
        </div>
        <input type="submit"/>
      </form>
      <textarea value={JSON.stringify(state, null, 2)} />
    </div>
  );
}

export default App;

