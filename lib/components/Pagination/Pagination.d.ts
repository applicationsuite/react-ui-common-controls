/// <reference types="react" />
import { IPaginationProps, IPaginationWithoutPages } from './Pagination.models';
export declare const getPaginationSummary: (pageNumber: number, pageSize: number, totalCount: number) => JSX.Element;
export declare const Pagination: (props: IPaginationProps) => JSX.Element | null;
export declare const PaginationWithoutPages: (props: IPaginationWithoutPages) => JSX.Element;
