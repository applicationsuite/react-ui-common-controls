import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { IconButton, Dropdown, DefaultButton } from '@fluentui/react';
import { PageType, IPaginationProps, IPaginationWithoutPages } from './Pagination.models';
import { paginationStyles } from './Pagination.styles';

const useStyles = createUseStyles(paginationStyles);

const defaultProps = {
  initialPage: 1,
  pageSize: 10,
  options: [10, 20, 30, 50, 100]
};

export const getPaginationSummary = (pageNumber: number, pageSize: number, totalCount: number) => {
  const startIndex = (pageNumber! - 1) * pageSize! + 1;
  const endIndex = Math.min(startIndex + pageSize! - 1, totalCount);

  const summary = (
    <span>
      {!(pageNumber && pageSize) && totalCount ? `Showing ${totalCount} Records` : ''}
      {pageNumber && pageSize && totalCount
        ? `Showing ${startIndex} to ${endIndex} of ${totalCount} Records`
        : ''}
    </span>
  );
  return summary;
};

export const Pagination = (props: IPaginationProps) => {
  let { pageSize, options, pageNumber, showSummary } = props;
  const { totalCount, onPaginationChange } = props;
  const classes = useStyles();

  pageNumber = pageNumber || defaultProps.initialPage;
  pageSize = pageSize || defaultProps.pageSize;
  options = options || defaultProps.options;
  showSummary = showSummary || false;

  const [currentPage, setCurrentPage] = React.useState(pageNumber);

  React.useEffect(() => {
    setCurrentPage(pageNumber!);
  }, [pageNumber]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const getPageRange = () => {
    let startPage = 1;
    let endPage;
    if (totalPages <= 5) {
      endPage = totalPages;
    } else if (pageNumber! <= 3) {
      endPage = 5;
    } else if (pageNumber! + 2 >= totalPages) {
      startPage = totalPages - 4;
      endPage = totalPages;
    } else {
      startPage = pageNumber! - 2;
      endPage = pageNumber! + 2;
    }
    return [...Array(endPage + 1 - startPage).keys()].map((i) => startPage + i);
  };

  const onPageChange = (pageNo: number) => {
    onPaginationChange && onPaginationChange(pageNo, pageSize);
  };

  const onPageSizeChange = (pagesize: number) => {
    onPaginationChange && onPaginationChange(1, pagesize);
  };

  const dropdownOptions = options.map((value, index) => ({
    key: value,
    text: String(value),
    id: String(index)
  }));

  if (totalCount === 0) {
    return null;
  }

  return (
    <div className={classes.pagination}>
      <div className={classes.container}>
        <Dropdown
          className={classes.dropdown}
          options={dropdownOptions}
          defaultSelectedKey={pageSize}
          onChange={(e, selectedOption) => {
            if (selectedOption) {
              onPageSizeChange(+selectedOption.key);
            }
          }}
        />
        <div className={classes.summary}>
          {showSummary && getPaginationSummary(currentPage, pageSize, totalCount)}
        </div>
      </div>
      <div className={classes.pages}>
        <IconButton
          iconProps={{ iconName: 'ChevronLeft' }}
          disabled={currentPage === 1}
          aria-label={currentPage === 1 ? 'Disabled Previous Page' : 'Previous Page'}
          onClick={() => onPageChange(currentPage - 1)}
        />

        {getPageRange().map((page, index) => (
          <div key={index}>
            <DefaultButton
              className={currentPage === page ? classes.selectedPage : classes.page}
              text={String(page)}
              aria-label={`Page ${page}`}
              onClick={() => onPageChange(page)}
            />
          </div>
        ))}
        <IconButton
          iconProps={{ iconName: 'ChevronRight' }}
          disabled={currentPage === totalPages}
          aria-label={currentPage === totalPages ? 'Disabled Next Page' : 'Next Page'}
          onClick={() => onPageChange(currentPage + 1)}
        />
      </div>
    </div>
  );
};

export const PaginationWithoutPages = (props: IPaginationWithoutPages) => {
  const classes = useStyles();
  const { isPreviousAllowed, isNextAllowed, onPageChange } = props;

  return (
    <div className={classes.paginationRight}>
      <IconButton
        iconProps={{ iconName: 'ChevronLeft' }}
        disabled={!isPreviousAllowed}
        aria-label={!isPreviousAllowed ? 'Disabled Previous Page' : 'Previous Page'}
        onClick={() => onPageChange(PageType.Previous)}
      />
      <IconButton
        iconProps={{ iconName: 'ChevronRight' }}
        disabled={!isNextAllowed}
        aria-label={!isNextAllowed ? 'Disabled Next Page' : 'Next Page'}
        onClick={() => onPageChange(PageType.Next)}
      />
    </div>
  );
};
