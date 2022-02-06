export enum PageType {
    Previous = 0,
    Next = 1
  }
  
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
  