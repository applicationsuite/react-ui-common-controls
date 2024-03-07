export const accordionStyles = (theme: string) => ({
  accordion: {},
  accordionHeader: {
    display: 'flex',
    cursor: 'pointer'
  },
  collapseIcon: {
    content: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='rgba%280,0,0,.5%29' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");`,
    padding: '3px',
    verticalAlign: 'middle'
  },

  collapseIconRotate: {
    transform: 'rotate(90deg)'
  },

  headerText: {
    fontSize: '16px',
    fontWeight: 600,
    padding: '3px',
    verticalAlign: 'middle'
  },
  accordionBody: {
    padding: '10px'
  }
});
