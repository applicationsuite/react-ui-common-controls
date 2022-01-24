import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { SearchBox, IconButton } from '@fluentui/react';
import { quickSearchStyles } from './QuickSearch.styles';

const useStyles = createUseStyles(quickSearchStyles);

export const QuickSearch = ({
  value,
  placeHolderText,
  onSearchTextChange,
  quickSearchOnEnter,
  hideSearchButton
}: {
  value?: string;
  placeHolderText?: string;
  onSearchTextChange: any;
  quickSearchOnEnter?: boolean;
  hideSearchButton?: boolean;
}) => {
  const classes = useStyles();

  const searchButtonRef: any = React.createRef();

  const onChange = (e?: React.ChangeEvent<HTMLInputElement>) => {
    onSearchTextChange && onSearchTextChange(e?.target.value);
  };

  const onSearch = (searchValue: string) => {
    if (searchValue === value) {
      return;
    }
    onSearchTextChange && onSearchTextChange(searchValue);
  };
  const onSearchButtonClick = () => {
    if (searchButtonRef.current && searchButtonRef.current.state.value === value) {
      return;
    }
    onSearchTextChange && onSearchTextChange(searchButtonRef.current.state.value);
  };

  const onClear = () => {
    onSearchTextChange('');
  };

  return (
    <div className={hideSearchButton ? classes.quickSearchWithoutButton : classes.quickSearch}>
      <SearchBox
        componentRef={searchButtonRef}
        value={value || ''}
        className={classes.quickSearchBox}
        placeholder={placeHolderText || 'Search'}
        onChange={quickSearchOnEnter ? undefined : onChange}
        onSearch={quickSearchOnEnter ? onSearch : undefined}
        onClear={onClear}
      />
      {!hideSearchButton && (
        <IconButton
          iconProps={{ iconName: 'Search' }}
          className={classes.quickSearchButton}
          ariaLabel="Search"
          onClick={onSearchButtonClick}
        />
      )}
    </div>
  );
};
