/// <reference types="react" />
import { PageType } from '../../';
export interface IPaginationProps {
    pageSize?: number;
    totalCount: number;
    options?: number[];
    pageNumber?: number;
    showSummary?: boolean;
    onPaginationChange: (pageNumber?: number, pageSize?: number) => void;
}
export interface IPaginationWithoutPages {
    isNextAllowed: boolean;
    isPreviousAllowed: boolean;
    onPageChange: (pageType: PageType) => void;
}
export declare const getPaginationSummary: (pageNumber: number, pageSize: number, totalCount: number) => JSX.Element;
export declare const Pagination: (props: IPaginationProps) => JSX.Element | null;
export declare const PaginationWithoutPages: (props: IPaginationWithoutPages) => JSX.Element;
