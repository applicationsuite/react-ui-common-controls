export const wizardStyles = (theme: string) => ({
  wizardVertical: {
    height: '100%'
  },
  wizardLinks: {
    width: '20%',
    maxWidth: '20%',
    overflow: 'auto'
  },
  wizardLinksCollapsed: {
    width: '30px',
    maxWidth: '30px',
    overflow: 'auto'
  },
  wizardContainer: {
    marginLeft: '0px !important',
    width: '80%',
    maxWidth: '80%',
    overflow: 'auto',
    height: '100%'
  },
  wizardDivider: {
    marginLeft: '0px !important',
    '& div': {
      width: 1,
      background: 'grey',
      height: 'calc(100vh)'
    }
  },
  stepCollapseExpandSection: {
    position: 'fixed',
    bottom: '0px',
    width: '19.5%',
    textAlign: 'right'
  },

  stepCollapseExpandSectionCollapsed: {
    position: 'fixed',
    bottom: '0px',
    textAlign: 'right',
    left: '5px'
  }
});
