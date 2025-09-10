import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';
import { useLocation, useNavigate } from 'react-router';
import { Dropdown, Icon, Menu } from 'semantic-ui-react';
import { IndiInfo, JsonGedcomData } from 'topola';
import { Media } from '../util/media';
import { MenuType } from './menu_item';
import { SearchBar } from './search';
import { UploadMenu } from './upload_menu';
import { UrlMenu } from './url_menu';
import { WikiTreeLoginMenu, WikiTreeMenu } from './wikitree_menu';

enum ScreenSize {
  LARGE,
  SMALL,
}

interface EventHandlers {
  onSelection: (indiInfo: IndiInfo) => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  onDownloadPng: () => void;
  onDownloadSvg: () => void;
}

interface Props {
  showingChart: boolean;
  data?: JsonGedcomData;
  standalone: boolean;
  allowAllRelativesChart: boolean;
  allowPrintAndDownload: boolean;
  eventHandlers: EventHandlers;
  showWikiTreeMenus: boolean;
}

export function TopBar(props: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  function changeView(view: string) {
    const search = queryString.parse(location.search);
    if (search.view !== view) {
      search.view = view;
      location.search = queryString.stringify(search);
      navigate(location);
    }
  }

  function chartMenus(screenSize: ScreenSize) {
    if (!props.showingChart) {
      return null;
    }
    const chartTypeItems = (
      <>
        <Dropdown.Item onClick={() => changeView('hourglass')}>
          <Icon name="hourglass" />
          <FormattedMessage id="menu.hourglass" defaultMessage="Hourglass chart" />
        </Dropdown.Item>
        {props.allowAllRelativesChart ? (
          <Dropdown.Item onClick={() => changeView('relatives')}>
            <Icon name="users" />
            <FormattedMessage id="menu.relatives" defaultMessage="All relatives" />
          </Dropdown.Item>
        ) : null}
        <Dropdown.Item onClick={() => changeView('donatso')}>
          <Icon name="users" />
          <FormattedMessage id="menu.donatso" defaultMessage="Donatso family chart" />
        </Dropdown.Item>
        <Dropdown.Item onClick={() => changeView('fancy')}>
          <Icon name="users" />
          <FormattedMessage id="menu.fancy" defaultMessage="Fancy tree (experimental)" />
        </Dropdown.Item>
      </>
    );
    switch (screenSize) {
      case ScreenSize.LARGE:
        return (
          <>
            {/*
            <Menu.Item
              onClick={props.eventHandlers.onPrint}
              disabled={!props.allowPrintAndDownload}
            >
              <Icon name="print" />
              <FormattedMessage id="menu.print" defaultMessage="Print" />
            </Menu.Item>

            <Dropdown
              trigger={
                <div>
                  <Icon name="download" />
                  <FormattedMessage id="menu.download" defaultMessage="Download" />
                </div>
              }
              className="item"
              disabled={!props.allowPrintAndDownload}
            >
              <Dropdown.Menu>
                <Dropdown.Item onClick={props.eventHandlers.onDownloadPdf}>
                  <FormattedMessage id="menu.pdf_file" defaultMessage="PDF file" />
                </Dropdown.Item>
                <Dropdown.Item onClick={props.eventHandlers.onDownloadPng}>
                  <FormattedMessage id="menu.png_file" defaultMessage="PNG file" />
                </Dropdown.Item>
                <Dropdown.Item onClick={props.eventHandlers.onDownloadSvg}>
                  <FormattedMessage id="menu.svg_file" defaultMessage="SVG file" />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            */}

            <Dropdown
              trigger={
                <div>
                  <Icon name="eye" />
                  <FormattedMessage id="menu.view" defaultMessage="View" />
                </div>
              }
              className="item"
            >
              <Dropdown.Menu>{chartTypeItems}</Dropdown.Menu>
            </Dropdown>
            <SearchBar
              data={props.data!}
              onSelection={props.eventHandlers.onSelection}
              {...props}
            />
          </>
        );

      case ScreenSize.SMALL:
        return (
          <>
            {/*
            <Dropdown.Item onClick={props.eventHandlers.onPrint}>
              <Icon name="print" />
              <FormattedMessage id="menu.print" defaultMessage="Print" />
            </Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item onClick={props.eventHandlers.onDownloadPdf}>
              <Icon name="download" />
              <FormattedMessage id="menu.download_pdf" defaultMessage="Download PDF" />
            </Dropdown.Item>
            <Dropdown.Item onClick={props.eventHandlers.onDownloadPng}>
              <Icon name="download" />
              <FormattedMessage id="menu.download_png" defaultMessage="Download PNG" />
            </Dropdown.Item>
            <Dropdown.Item onClick={props.eventHandlers.onDownloadSvg}>
              <Icon name="download" />
              <FormattedMessage id="menu.download_svg" defaultMessage="Download SVG" />
            </Dropdown.Item>

            <Dropdown.Divider />
            */}
            {chartTypeItems}
            <Dropdown.Divider />
          </>
        );
    }
  }

  function title() {
    return (
      <Menu.Item>
        <b>Shaykh. Sayyid. Sulaiman van Arabia - Patrilineal Genealogy</b>
      </Menu.Item>
    );
  }

  function fileMenus(screenSize: ScreenSize) {
    if (!props.standalone && props.showWikiTreeMenus) {
      switch (screenSize) {
        case ScreenSize.LARGE:
          return <WikiTreeMenu menuType={MenuType.Menu} {...props} />;
        case ScreenSize.SMALL:
          return (
            <>
              <WikiTreeMenu menuType={MenuType.Dropdown} {...props} />
              <Dropdown.Divider />
            </>
          );
      }
    }

    if (!props.standalone) {
      return null;
    }

    switch (screenSize) {
      case ScreenSize.LARGE:
        const menus = props.showingChart ? (
          <Dropdown
            trigger={
              <div>
                <Icon name="folder open" />
                <FormattedMessage id="menu.open" defaultMessage="Open" />
              </div>
            }
            className="item"
          >
            <Dropdown.Menu>
              <UploadMenu menuType={MenuType.Dropdown} {...props} />
              <UrlMenu menuType={MenuType.Dropdown} {...props} />
              <WikiTreeMenu menuType={MenuType.Dropdown} {...props} />
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <>
            <UploadMenu menuType={MenuType.Menu} {...props} />
            <UrlMenu menuType={MenuType.Menu} {...props} />
            <WikiTreeMenu menuType={MenuType.Menu} {...props} />
          </>
        );
        return menus;

      case ScreenSize.SMALL:
        return (
          <>
            <UploadMenu menuType={MenuType.Dropdown} {...props} />
            <UrlMenu menuType={MenuType.Dropdown} {...props} />
            <WikiTreeMenu menuType={MenuType.Dropdown} {...props} />
            <Dropdown.Divider />
          </>
        );
    }
  }

  function wikiTreeLoginMenu(screenSize: ScreenSize) {
    if (!props.showWikiTreeMenus) {
      return null;
    }
    return (
      <>
        <WikiTreeLoginMenu
          menuType={screenSize === ScreenSize.SMALL ? MenuType.Dropdown : MenuType.Menu}
          {...props}
        />
        {screenSize === ScreenSize.SMALL ? <Dropdown.Divider /> : null}
      </>
    );
  }

  function mobileMenus() {
    return (
      <>
        <Dropdown
          trigger={
            <div>
              <Icon name="sidebar" />
            </div>
          }
          className="item"
          icon={null}
        >
          <Dropdown.Menu>
            {fileMenus(ScreenSize.SMALL)}
            {chartMenus(ScreenSize.SMALL)}
            {wikiTreeLoginMenu(ScreenSize.SMALL)}

            {/*
            <Dropdown.Item
              href="https://github.com/PeWu/topola-viewer"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FormattedMessage id="menu.github" defaultMessage="GitHub project" />
            </Dropdown.Item>
            */}
          </Dropdown.Menu>
        </Dropdown>

        {title()}
      </>
    );
  }

  function desktopMenus() {
    return (
      <>
        {title()}
        {fileMenus(ScreenSize.LARGE)}
        {chartMenus(ScreenSize.LARGE)}
        {/*
        <Menu.Menu position="right">
          {wikiTreeLoginMenu(ScreenSize.LARGE)}
          <Menu.Item
            href="https://github.com/PeWu/topola-viewer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FormattedMessage id="menu.github" defaultMessage="GitHub project" />
          </Menu.Item>
        </Menu.Menu>
        */}
      </>
    );
  }

  return (
    <>
      <Menu
        as={Media}
        greaterThanOrEqual="large"
        attached="top"
        inverted
        color="blue"
        size="large"
      >
        {desktopMenus()}
      </Menu>
      <Menu
        as={Media}
        at="small"
        attached="top"
        inverted
        color="blue"
        size="large"
      >
        {mobileMenus()}
      </Menu>
    </>
  );
}
