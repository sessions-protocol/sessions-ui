
import React, { ReactNode, useContext, useMemo } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import * as Yup from 'yup';
import { AnySchema } from 'yup';
import Lazy from 'yup/lib/Lazy';
import Reference from 'yup/lib/Reference';

export interface DefaultPagePropsFallbackProps {
  error?: Error;
}
export function DefaultPagePropsFallback(props: DefaultPagePropsFallbackProps) {
  return (
    <div className="container mx-auto px-2 sm:px-0 h-full dark:text-white">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex flex-col mt-32" style={{ width: 420 }}>
          <div>{props.error?.message || 'Invalid page query params.'}</div>
        </div>
      </div>
    </div>
  )
}

// export const web3AddressValidation = Yup.string()
// .required('url query `address` is required.')
// .test('web3-address', 'Invalid Wallet Address.', (value?: string) => {
//   if (!value) return false;
//   return checkValidAddress(value)
// })

export function createPagePropsContext<
  P extends {},
  D extends {},
  T = {
    key: string;
    params: P;
    data: D;
  },
>(config: {
  key: string;
  validation: {
    [K in keyof P]: AnySchema<any, any, any> | Reference<unknown> | Lazy<any, any>;
  };
}, defaultValue?: T | null) {

  const Context = React.createContext<T | null>(defaultValue || null)
  Context.displayName = `PageProps(${config.key})`

  const Consumer = Context.Consumer
  const displayName = Context.displayName

  const Provider = (props: {
    data: D;
    children?: ReactNode | undefined;
    fallback?: (error?: Error) => ReactNode;
  }) => {
    const _params = useParams()
    const [_searchParams] = useSearchParams()
    const params = Object.assign({}, Object.fromEntries(_searchParams.entries()), _params)

    const error = useMemo(() => {
      try {
        Yup.object(config.validation).validateSync(params, { strict: true });
      } catch (error: any) {
        return error
      }
    }, [params, config.validation])

    const value = useMemo(() => {
      return {
        key: config.key,
        data: props.data,
        params: params as any,
      } as unknown as T
    }, [config.key, params])

    return (
      <Context.Provider value={value}>
        {error && (props.fallback ? props.fallback(error) : <DefaultPagePropsFallback error={error} />)}
        {!error && props.children}
      </Context.Provider>
    )
  }

  const usePageContext = () => {
    const context = useContext(Context)
    if (!context) {
      console.warn('please use PageProps in PagePropsProvider')
      throw new Error('please use PageProps in PagePropsProvider')
    }
    return context;
  }

  return {
    Context,
    displayName,
    Consumer,
    Provider,
    usePageContext,
  }
}
