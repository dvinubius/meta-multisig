import { SwapOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { errorColor } from '~~/styles/styles';

// small change in useEffect, display currentValue if it's provided by user

/*
  ~ What it does? ~

  Displays input field for ETH/USD amount, with an option to convert between ETH and USD

  ~ How can I use? ~

  <EtherInput
    autofocus
    price={price}
    value=100
    placeholder="Enter amount"
    onChange={value => {
      setAmount(value);
    }}
  />

  ~ Features ~

  - Provide price={price} of ether and easily convert between USD and ETH
  - Provide value={value} to specify initial amount of ether
  - Provide placeholder="Enter amount" value for the input
  - Control input change by onChange={value => { setAmount(value);}}
*/

interface IEtherInputProps {
  autoFocus?: boolean;
  price: number | undefined;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  etherMode?: boolean;
  wrapperStyle?: any;
  switchWidth?: number;
}

/**
 * Displays input field for ETH/USD amount, with an option to convert between ETH and USD
  ~ Features ~

  - Provide price={price} of ether and easily convert between USD and ETH
  - Provide value={value} to specify initial amount of ether
  - Provide placeholder="Enter amount" value for the input
  - Control input change by onChange={value => { setAmount(value);}}
 * @param props
 * @returns (FC)
 */
export const EtherInput: FC<IEtherInputProps> = (props) => {
  const [mode, setMode] = useState(props.etherMode ? 'ETH' : props.price ? 'USD' : 'ETH');
  const [display, setDisplay] = useState<string>();
  const [value, setValue] = useState<string>();
  const [error, setError] = useState<string>();

  const currentValue: string | undefined = props.value ? props.value : value;

  const option = (title: string): ReactNode => {
    if (props?.price == null) {
      return <></>;
    }

    const titleWrap = (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
        <SwapOutlined />
        <span>{title}</span>
      </div>
    );
    return (
      <div
        style={{ cursor: 'pointer', width: props.switchWidth ?? '3.5rem' }}
        onClick={(): void => {
          if (mode === 'USD') {
            setMode('ETH');
            setDisplay(currentValue);
          } else {
            setMode('USD');
            if (currentValue) {
              const usdValue = '' + (parseFloat(currentValue) * props.price!).toFixed(2);
              setDisplay(usdValue);
            } else {
              setDisplay(currentValue);
            }
          }
        }}>
        {titleWrap}
      </div>
    );
  };

  let prefix;
  let addonAfter;
  if (mode === 'USD') {
    prefix = '$';
    addonAfter = option('USD');
  } else {
    prefix = 'Ξ';
    addonAfter = option('ETH');
  }

  useEffect((): void => {
    if (!currentValue) {
      setDisplay('');
    }
  }, [currentValue]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <Input
        placeholder={props.placeholder ? props.placeholder : 'amount in ' + mode}
        autoFocus={props.autoFocus}
        prefix={prefix}
        value={display}
        addonAfter={addonAfter}
        onChange={(e): void => {
          const newValue = e.target.value;
          setError('');
          const possibleNewValue = isNaN(Number(newValue)) ? null : parseFloat(newValue);
          if (!possibleNewValue) {
            setError('Invalid input');
            if (typeof props.onChange === 'function') {
              props.onChange('');
            }
          } else {
            const ethVal = mode === 'USD' ? (possibleNewValue / (props.price ?? 1)).toString() : newValue;
            if (typeof props.onChange === 'function') {
              props.onChange(ethVal);
            }
            setValue(ethVal);
          }

          setDisplay(newValue);
        }}
      />
      {error && <div style={{ color: errorColor, fontSize: '0.75rem' }}>{error}</div>}
    </div>
  );
};
