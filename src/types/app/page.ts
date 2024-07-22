import * as entry from '../../pages/index'; // 确保路径正确
import type { ResolvingMetadata, ResolvingViewport } from 'next/dist/lib/metadata/types/metadata-interface.js';

type TEntry = typeof import('../../pages/index');

// 检查 entry 是否是一个有效的 entry
checkFields<Diff<{
  default: Function;
  config?: {};
  generateStaticParams?: Function;
  revalidate?: RevalidateRange<TEntry> | false;
  dynamic?: 'auto' | 'force-dynamic' | 'error' | 'force-static';
  dynamicParams?: boolean;
  fetchCache?: 'auto' | 'force-no-store' | 'only-no-store' | 'default-no-store' | 'default-cache' | 'only-cache' | 'force-cache';
  preferredRegion?: 'auto' | 'global' | 'home' | string | string[];
  runtime?: 'nodejs' | 'experimental-edge' | 'edge';
  maxDuration?: number;
  metadata?: any;
  generateMetadata?: Function;
  viewport?: any;
  generateViewport?: Function;
}, TEntry, ''>>();

// 检查 entry 函数的 prop 类型
checkFields<Diff<PageProps, FirstArg<TEntry['default']>, 'default'>>();

// 检查 generateMetadata 函数的参数和返回类型
if ('generateMetadata' in entry) {
  checkFields<Diff<PageProps, FirstArg<MaybeField<TEntry, 'generateMetadata'>>, 'generateMetadata'>>();
  checkFields<Diff<ResolvingMetadata, SecondArg<MaybeField<TEntry, 'generateMetadata'>>, 'generateMetadata'>>();
}

// 检查 generateViewport 函数的参数和返回类型
if ('generateViewport' in entry) {
  checkFields<Diff<PageProps, FirstArg<MaybeField<TEntry, 'generateViewport'>>, 'generateViewport'>>();
  checkFields<Diff<ResolvingViewport, SecondArg<MaybeField<TEntry, 'generateViewport'>>, 'generateViewport'>>();
}

// 检查 generateStaticParams 函数的参数和返回类型
if ('generateStaticParams' in entry) {
  checkFields<Diff<{ params: PageParams }, FirstArg<MaybeField<TEntry, 'generateStaticParams'>>, 'generateStaticParams'>>();
  checkFields<Diff<{ __tag__: 'generateStaticParams', __return_type__: any[] | Promise<any[]> }, { __tag__: 'generateStaticParams', __return_type__: ReturnType<MaybeField<TEntry, 'generateStaticParams'>> }>>();
}

type PageParams = any;
export interface PageProps {
  params?: any;
  searchParams?: any;
}
export interface LayoutProps {
  children?: React.ReactNode;
  params?: any;
}

// =============
// Utility types
type RevalidateRange<T> = T extends { revalidate: any } ? NonNegative<T['revalidate']> : never;

// 如果 T 是 unknown 或 any，它将是一个空的 {} 类型。否则，它将与 Omit<T, keyof Base> 相同。
type OmitWithTag<T, K extends keyof any, _M> = Omit<T, K>;
type Diff<Base, T extends Base, Message extends string = ''> = 0 extends (1 & T) ? {} : OmitWithTag<T, keyof Base, Message>;

type FirstArg<T extends Function> = T extends (...args: [infer T, any]) => any ? unknown extends T ? any : T : never;
type SecondArg<T extends Function> = T extends (...args: [any, infer T]) => any ? unknown extends T ? any : T : never;
type MaybeField<T, K extends string> = T extends { [k in K]: infer G } ? G extends Function ? G : never : never;

function checkFields<_ extends { [k in keyof any]: never }>() {}

// https://github.com/sindresorhus/type-fest
type Numeric = number | bigint;
type Zero = 0 | 0n;
type Negative<T extends Numeric> = T extends Zero ? never : `${T}` extends `-${string}` ? T : never;
type NonNegative<T extends Numeric> = T extends Zero ? T : Negative<T> extends never ? T : '__invalid_negative_number__';
