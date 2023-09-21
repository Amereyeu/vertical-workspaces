/**
 * V-Shell (Vertical Workspaces)
 * extension.js
 *
 * @author     GdH <G-dH@github.com>
 * @copyright  2022 - 2023
 * @license    GPL-3.0
 *
 */

'use strict';

import GLib from 'gi://GLib';
import Clutter from 'gi://Clutter';
import St from 'gi://St';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Pango from 'gi://Pango';
import Graphene from 'gi://Graphene';
import Atk from 'gi://Atk';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as Workspace from 'resource:///org/gnome/shell/ui/workspace.js';
import * as Search from 'resource:///org/gnome/shell/ui/search.js';
import * as DND from 'resource:///org/gnome/shell/ui/dnd.js';
import * as AppDisplay from 'resource:///org/gnome/shell/ui/appDisplay.js';
import * as IconGrid from 'resource:///org/gnome/shell/ui/iconGrid.js';
import * as Dash from 'resource:///org/gnome/shell/ui/dash.js';
import * as AppFavorites from 'resource:///org/gnome/shell/ui/appFavorites.js';
import * as Overview from 'resource:///org/gnome/shell/ui/overview.js';
import * as Panel from 'resource:///org/gnome/shell/ui/panel.js';
import * as SwipeTracker from 'resource:///org/gnome/shell/ui/swipeTracker.js';
import * as AltTab from 'resource:///org/gnome/shell/ui/altTab.js';
import * as Layout from 'resource:///org/gnome/shell/ui/layout.js';
import * as OsdWindow from 'resource:///org/gnome/shell/ui/osdWindow.js';
import * as OverviewControls from 'resource:///org/gnome/shell/ui/overviewControls.js';
import * as WorkspacesView from 'resource:///org/gnome/shell/ui/workspacesView.js';
import * as WorkspaceThumbnail from 'resource:///org/gnome/shell/ui/workspaceThumbnail.js';
import * as Background from 'resource:///org/gnome/shell/ui/background.js';
import * as MessageTray from 'resource:///org/gnome/shell/ui/messageTray.js';
import * as WindowAttentionHandler from 'resource:///org/gnome/shell/ui/windowAttentionHandler.js';
import * as WindowManager from 'resource:///org/gnome/shell/ui/windowManager.js';
import * as WindowPreview from 'resource:///org/gnome/shell/ui/windowPreview.js';
import * as WorkspaceSwitcherPopup from 'resource:///org/gnome/shell/ui/workspaceSwitcherPopup.js';
import * as WorkspaceAnimation from 'resource:///org/gnome/shell/ui/workspaceAnimation.js';
import * as AppMenu from 'resource:///org/gnome/shell/ui/appMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as BoxPointer from 'resource:///org/gnome/shell/ui/boxpointer.js';
import * as ExtensionUtils from 'resource:///org/gnome/shell/misc/extensionUtils.js';
import * as Util from 'resource:///org/gnome/shell/misc/util.js';
import * as ModalDialog from 'resource:///org/gnome/shell/ui/modalDialog.js';
import * as Params from 'resource:///org/gnome/shell/misc/params.js';
import * as SystemActions from 'resource:///org/gnome/shell/misc/systemActions.js';

import * as Config from 'resource:///org/gnome/shell/misc/config.js';

import * as Settings from './lib/settings.js';
import * as _Util from './lib/util.js';
import * as AppDisplayOverride from './lib/appDisplay.js';

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

import { LayoutModule } from './lib/layout.js';
import { WorkspacesViewModule } from './lib/workspacesView.js';
import { WorkspaceThumbnailModule } from './lib/workspaceThumbnail.js';
import { AppDisplayModule } from './lib/appDisplay.js';
import { AppFavoritesModule } from './lib/appFavorites.js';
import { DashModule } from './lib/dash.js';
import { IconGridModule } from './lib/iconGrid.js';
import { MessageTrayModule } from './lib/messageTray.js';
import { OsdWindowModule } from './lib/osdWindow.js';
import { OverlayKeyModule } from './lib/overlayKey.js';
import { OverviewModule } from './lib/overview.js';
import { OverviewControlsModule } from './lib/overviewControls.js';
import { PanelModule } from './lib/panel.js';
import { SearchControllerModule } from './lib/searchController.js';
import { SearchModule } from './lib/search.js';
import { SwipeTrackerModule } from './lib/swipeTracker.js';
import { WindowAttentionHandlerModule } from './lib/windowAttentionHandler.js';
import { WindowManagerModule } from './lib/windowManager.js';
import { WindowPreviewModule } from './lib/windowPreview.js';
import { WorkspaceAnimationModule } from './lib/workspaceAnimation.js';
import { WorkspaceModule } from './lib/workspace.js';
import { WorkspaceSwitcherPopupModule } from './lib/workspaceSwitcherPopup.js';
import { WindowSearchProviderModule } from './lib/windowSearchProvider.js';
import { WinTmbModule } from './lib/winTmb.js';
// import { RecentFilesSearchProviderModule } from './lib/recentFilesSearchProvider.js';

let Gi;
let Ui;
let Misc;
let Me;

// gettext
let _;
let opt;

export default class VShell extends Extension {
    _init() {
        Gi = {};
        Ui = {};
        Misc = {};
        Me = {};

        Gi._Gi = imports._gi;
        Gi.GLib = GLib;
        Gi.Clutter = Clutter;
        Gi.St = St;
        Gi.Meta = Meta;
        Gi.Shell = Shell;
        Gi.GObject = GObject;
        Gi.Gio = Gio;
        Gi.Pango = Pango;
        Gi.Graphene = Graphene;
        // Gi.Gtk = Gtk;
        Gi.Atk = Atk;

        Ui.Main = Main;
        Ui.Workspace = Workspace;
        Ui.Search = Search;
        Ui.DND = DND;
        Ui.AppDisplay = AppDisplay;
        Ui.IconGrid = IconGrid;
        Ui.Dash = Dash;
        Ui.AppFavorites = AppFavorites;
        Ui.Overview = Overview;
        Ui.Panel = Panel;
        Ui.SwipeTracker = SwipeTracker;
        Ui.AltTab = AltTab;
        Ui.Layout = Layout;
        Ui.OsdWindow = OsdWindow;
        Ui.OverviewControls = OverviewControls;
        Ui.WorkspacesView = WorkspacesView;
        Ui.WorkspaceThumbnail = WorkspaceThumbnail;
        Ui.Background = Background;
        Ui.MessageTray = MessageTray;
        Ui.WindowAttentionHandler = WindowAttentionHandler;
        Ui.WindowManager = WindowManager;
        Ui.WindowPreview = WindowPreview;
        Ui.WorkspaceSwitcherPopup = WorkspaceSwitcherPopup;
        Ui.WorkspaceAnimation = WorkspaceAnimation;
        Ui.AppMenu = AppMenu;
        Ui.PopupMenu = PopupMenu;
        Ui.BoxPointer = BoxPointer;
        Ui.Params = Params;

        Misc.Config = Config;
        Misc.shellVersion = parseFloat(Misc.Config.PACKAGE_VERSION);
        Misc.ExtensionUtils = ExtensionUtils;
        Misc.Util = Util;
        Misc.SystemActions = SystemActions;
        Misc.getSettings = this.getSettings.bind(this);

        Me.metadata = this.metadata;
        Me.gSettings = this.getSettings();
        Me.gettext = this.gettext.bind(this);
        _ = Me.gettext;
        Me.Settings = Settings;
        Me.Util = _Util;
        Me.AppDisplayOverride = AppDisplayOverride;
        Me.WSP_PREFIX = WindowSearchProviderModule._PREFIX;
        // Me.RFSP_PREFIX = RecentFilesSearchProviderModule._PREFIX;
        Me.repairOverrides = this._repairOverrides;

        Me.opt = new Me.Settings.Options(Gi, Me);

        Me.Util.init(Gi, Ui, Misc, Me);
    }

    cleanGlobals() {
        Gi = null;
        Ui = null;
        Misc = null;
        Me = null;
    }

    enable() {
        this._init();
        // flag for Util.getEnabledExtensions()
        Me.extensionsLoadIncomplete = Ui.Main.layoutManager._startingUp;
        opt = Me.opt;

        this._initModules();
        this.activateVShell();

        Me.extensionsLoadIncomplete = false;
        log(`${Me.metadata.name}: enabled`);
    }

    // Reason for using "unlock-dialog" session mode:
    // Updating the "appDisplay" content every time the screen is locked/unlocked takes quite a lot of time and affects the user experience.
    disable() {
        this.removeVShell();
        this._disposeModules();

        // If Dash to Dock is enabled, disabling V-Shell can end in broken overview
        Ui.Main.overview.hide();
        Me.Util.cleanGlobals();
        log(`${Me.metadata.name}: disabled`);
    }

    _getModuleList() {
        return Object.keys(Me.Modules);
    }

    _initModules() {
        Me.Modules = {};
        Me.Modules.appDisplayModule = new AppDisplayModule(Gi, Ui, Misc, Me);
        Me.Modules.appFavoritesModule = new AppFavoritesModule(Gi, Ui, Misc, Me);
        Me.Modules.dashModule = new DashModule(Gi, Ui, Misc, Me);
        Me.Modules.iconGridModule = new IconGridModule(Gi, Ui, Misc, Me);
        Me.Modules.layoutModule = new LayoutModule(Gi, Ui, Misc, Me);
        Me.Modules.messageTrayModule = new MessageTrayModule(Gi, Ui, Misc, Me);
        Me.Modules.overviewModule = new OverviewModule(Gi, Ui, Misc, Me);
        Me.Modules.overviewControlsModule = new OverviewControlsModule(Gi, Ui, Misc, Me);
        Me.Modules.osdWindowModule = new OsdWindowModule(Gi, Ui, Misc, Me);
        Me.Modules.overlayKeyModule = new OverlayKeyModule(Gi, Ui, Misc, Me);
        Me.Modules.panelModule = new PanelModule(Gi, Ui, Misc, Me);
        Me.Modules.searchModule = new SearchModule(Gi, Ui, Misc, Me);
        Me.Modules.searchControllerModule = new SearchControllerModule(Gi, Ui, Misc, Me);
        Me.Modules.swipeTrackerModule = new SwipeTrackerModule(Gi, Ui, Misc, Me);
        Me.Modules.windowAttentionHandlerModule = new WindowAttentionHandlerModule(Gi, Ui, Misc, Me);
        Me.Modules.windowPreviewModule = new WindowPreviewModule(Gi, Ui, Misc, Me);
        Me.Modules.windowManagerModule = new WindowManagerModule(Gi, Ui, Misc, Me);
        Me.Modules.workspaceModule = new WorkspaceModule(Gi, Ui, Misc, Me);
        Me.Modules.workspaceAnimationModule = new WorkspaceAnimationModule(Gi, Ui, Misc, Me);
        Me.Modules.workspaceSwitcherPopupModule = new WorkspaceSwitcherPopupModule(Gi, Ui, Misc, Me);
        Me.Modules.workspaceThumbnailModule = new WorkspaceThumbnailModule(Gi, Ui, Misc, Me);
        Me.Modules.workspacesViewModule = new WorkspacesViewModule(Gi, Ui, Misc, Me);
        Me.Modules.windowSearchProviderModule = new WindowSearchProviderModule(Gi, Ui, Misc, Me);
        // Me.Modules.recentFilesSearchProviderModule = new RecentFilesSearchProviderModule(Gi, Ui, Misc, Me);
        Me.Modules.winTmbModule = new WinTmbModule(Gi, Ui, Misc, Me);
    }

    _disposeModules() {
        Me.opt.destroy();
        Me.opt = null;

        for (let module of this._getModuleList())
            Me.Modules[module].cleanGlobals();
        Me.Modules = null;
        opt = null;
    }

    activateVShell() {
        this._enabled = true;

        this._originalGetNeighbor = Gi.Meta.Workspace.prototype.get_neighbor;

        this._removeTimeouts();
        this._timeouts = {};

        // load VShell configuration
        this._updateSettings();

        // activate all enabled VShell modules
        this._updateOverrides();

        // connect signals to help VShell adapt to changes in DE configuration
        this._updateConnections();

        // switch PageUp/PageDown workspace switcher shortcuts
        this._switchPageShortcuts();

        // if Dash to Dock detected force enable "Fix for DtD" option
        this._updateFixDashToDockOption();

        // update overview background wallpaper if enabled, but don't set it too early on session startup
        // because it crashes wayland
        if (!Ui.Main.layoutManager._startingUp || Gi.Meta.is_restart())
            Ui.Main.overview._overview.controls._setBackground();

        this._updateSettingsConnection();

        // store dash _workId so we will be able to detect replacement when entering overview
        this._storeDashId();

        // workaround for upstream bug - overview always shows workspace 1 instead of the active one after restart
        this._setInitialWsIndex();
    }

    removeVShell() {
        this._enabled = false;

        const reset = true;
        this._removeTimeouts();

        this._removeConnections();
        Ui.Main.overview._overview.controls._setBackground(reset);

        // remove changes mede by VShell modules
        this._updateOverrides(reset);

        // switch PageUp/PageDown workspace switcher shortcuts
        this._switchPageShortcuts();

        // remove any position offsets from dash and ws thumbnails
        if (!Me.Util.dashNotDefault()) {
            Ui.Main.overview.dash.translation_x = 0;
            Ui.Main.overview.dash.translation_y = 0;
        }
        Ui.Main.overview._overview._controls._thumbnailsBox.translation_x = 0;
        Ui.Main.overview._overview._controls._thumbnailsBox.translation_y = 0;
        Ui.Main.overview._overview._controls._searchEntryBin.translation_y = 0;
        Ui.Main.overview._overview._controls.set_child_above_sibling(Ui.Main.overview._overview._controls._workspacesDisplay, null);
        // restore default animation speed
        Gi.St.Settings.get().slow_down_factor = 1;

        // restore default dash background style
        Ui.Main.overview.dash._background.set_style('');
        // hide status message if shown
        this._showStatusMessage(false);
        this._prevDash = null;

        Gi.Meta.Workspace.prototype.get_neighbor = this._originalGetNeighbor;
    }

    _removeTimeouts() {
        if (this._timeouts) {
            Object.values(this._timeouts).forEach(id => {
                if (id)
                    Gi.GLib.source_remove(id);
            });
        }
        this._timeouts = null;
    }

    _storeDashId() {
        this._prevDash = Ui.Main.overview.dash._workId;
    }

    _setInitialWsIndex() {
        if (Ui.Main.layoutManager._startingUp) {
            Gi.GLib.idle_add(Gi.GLib.PRIORITY_LOW, () => {
                Ui.Main.overview._overview.controls._workspaceAdjustment.set_value(global.workspace_manager.get_active_workspace_index());
            });
        }
    }

    _updateSettingsConnection() {
        if (!opt._extensionUpdateId)
            opt._extensionUpdateId = opt.connect('changed', this._updateSettings.bind(this));
    }

    _updateFixDashToDockOption() {
        const dtdEnabled = !!(Me.Util.getEnabledExtensions('dash-to-dock').length ||
                              Me.Util.getEnabledExtensions('ubuntu-dock').length);

        // force enable Fix Dash to Dock option if DtD detected
        opt._watchDashToDock = dtdEnabled;
    }

    _updateConnections() {
        if (!this._monitorsChangedConId)
            this._monitorsChangedConId = Ui.Main.layoutManager.connect('monitors-changed', () => this._updateVShell(2000));


        if (!this._showingOverviewConId)
            this._showingOverviewConId = Ui.Main.overview.connect('showing', this._onShowingOverview.bind(this));

        if (!this._sessionModeConId) {
            // the panel must be visible when screen is locked
            this._sessionModeConId = Ui.Main.sessionMode.connect('updated', () => {
                if (Ui.Main.sessionMode.isLocked) {
                    Me.Modules.panelModule.update(true);
                } else {
                    // delayed because we need to be able to fix potential damage caused by other extensions during unlock
                    this._timeouts.unlock = Gi.GLib.idle_add(Gi.GLib.PRIORITY_LOW,
                        () => {
                            Me.Modules.panelModule.update();
                            Me.Modules.overviewControlsModule.update();

                            this._timeouts.unlock = 0;
                            return Gi.GLib.SOURCE_REMOVE;
                        }
                    );
                }
            });
        }

        if (!this._watchDockSigId) {
            this._watchDockSigId = Ui.Main.extensionManager.connect('extension-state-changed',
                (source, extension) => {
                    const uuid = extension.uuid;
                    // ExtensionState = {
                    //     ENABLED: 1,
                    //     DISABLED: 2,
                    //     ERROR: 3,
                    //     OUT_OF_DATE: 4,
                    //     DOWNLOADING: 5,
                    //     INITIALIZED: 6,
                    //     DISABLING: 7,
                    //     ENABLING: 8,
                    //
                    //     // Used as an error state for operations on unknown extensions,
                    //     // should never be in a real extensionMeta object.
                    //     UNINSTALLED: 99,
                    // };
                    // no need to restart on disable/remove
                    //  - if DtD was enabled before VShell, VShell will be rebased by extensionSystem
                    //  - if DtD was enabled after VShell, the first _showingOverview detect replacement of the dash and repair VShell
                    const reset = [1, 2].includes(extension.state);
                    const dashReplacement = uuid.includes('dash-to-dock') || uuid.includes('ubuntu-dock') || uuid.includes('dash-to-panel');
                    if (dashReplacement && reset)
                        opt._watchDashToDock = true;
                    if (!Ui.Main.layoutManager._startingUp && reset && dashReplacement)
                        this._updateVShell(1999);
                }
            );
        }
    }

    _removeConnections() {
        if (this._monitorsChangedConId) {
            Ui.Main.layoutManager.disconnect(this._monitorsChangedConId);
            this._monitorsChangedConId = 0;
        }

        if (this._showingOverviewConId) {
            Ui.Main.overview.disconnect(this._showingOverviewConId);
            this._showingOverviewConId = 0;
        }

        if (this._sessionModeConId) {
            Ui.Main.sessionMode.disconnect(this._sessionModeConId);
            this._sessionModeConId = 0;
        }

        if (this._watchDockSigId) {
            Ui.Main.extensionManager.disconnect(this._watchDockSigId);
            this._watchDockSigId = 0;
        }
    }

    _updateOverrides(reset = false) {
        Me.Modules.workspacesViewModule.update(reset);
        Me.Modules.workspaceThumbnailModule.update(reset);
        Me.Modules.overviewModule.update(reset);
        Me.Modules.overviewControlsModule.update(reset);

        Me.Modules.workspaceModule.update(reset);
        Me.Modules.windowPreviewModule.update(reset);
        Me.Modules.windowManagerModule.update(reset);

        Me.Modules.layoutModule.update(reset);
        Me.Modules.dashModule.update(reset);
        Me.Modules.panelModule.update(reset);
        // the panel must be visible when screen is locked
        // at startup time, panel will be updated from the startupAnimation after allocation
        if (!reset && Ui.Main.sessionMode.isLocked && !Ui.Main.layoutManager._startingUp)
            Me.Modules.panelModule._showPanel(true);
            // PanelModule._showPanel(true);
            // hide panel so it appears directly on the final place
        /* else if (Ui.Main.layoutManager._startingUp && !Meta.is_restart())
            Ui.Main.panel.opacity = 0;*/

        Me.Modules.workspaceAnimationModule.update(reset);
        Me.Modules.workspaceSwitcherPopupModule.update(reset);

        Me.Modules.swipeTrackerModule.update(reset);

        Me.Modules.searchModule.update(reset);

        Me.Modules.windowSearchProviderModule.update(reset);
        // Me.Modules.recentFilesSearchProviderModule.update(reset);

        // don't rebuild app grid on any screen lock
        // even if the extension includes unlock-screen session mode
        // disable/enable is called at least once even on GS44
        // when screen lock is activated for the first time
        // because every first disable of each extension rebases
        // the entire extensions stack that was enabled later
        if (Ui.Main.sessionMode.isLocked)
            this._sessionLockActive = true;

        // This covers unnecessary enable/disable cycles during first screen lock, but is not allowed by the EGO rules
        // if (!this._sessionLockActive || !Ui.Main.extensionManager._getEnabledExtensions().includes(Me.metadata.uuid)) {
        // Avoid showing status at startup, can cause freeze
        //    if (!Ui.Main.layoutManager._startingUp)
        //        this._showStatusMessage();
        // IconGrid needs to be patched before AppDisplay
        //    Me.Modules.iconGridModule.update(reset);
        //    Me.Modules.appDisplayModule.update(reset);
        // } else {
        //    this._sessionLockActive = false;
        //    this._showStatusMessage(false);
        // }

        if (!this._sessionLockActive && !Ui.Main.layoutManager._startingUp && opt.APP_GRID_PERFORMANCE) {
            // Avoid showing status at startup, can cause freeze
            this._showStatusMessage();
        } else if (this._sessionLockActive) {
            this._sessionLockActive = false;
            this._showStatusMessage(false);
        }
        // iconGridModule will be updated from appDisplayModule
        Me.Modules.appDisplayModule.update(reset);

        Me.Modules.windowAttentionHandlerModule.update(reset);
        Me.Modules.appFavoritesModule.update(reset);
        Me.Modules.messageTrayModule.update(reset);
        Me.Modules.osdWindowModule.update(reset);
        Me.Modules.overlayKeyModule.update(reset);
        Me.Modules.searchControllerModule.update(reset);
        Me.Modules.winTmbModule.update(reset);

        if (!reset)
            Ui.Main.overview._overview.controls.setInitialTranslations();
    }

    _onShowingOverview() {
        if (Ui.Main.layoutManager._startingUp)
            return;

        Ui.Main.overview._overview.controls.opacity = 255;

        // store pointer X coordinate for OVERVIEW_MODE 1 window spread - if mouse pointer is steady, don't spread
        opt.showingPointerX = global.get_pointer()[0];

        if (!Ui.Main.overview._overview.controls._bgManagers && (opt.SHOW_BG_IN_OVERVIEW || opt.SHOW_WS_PREVIEW_BG) && !Me.Util.getEnabledExtensions('blur-my-shell').length)
            Ui.Main.overview._overview.controls._setBackground();

        if (opt._watchDashToDock) {
            // workaround for Dash to Dock (Ubuntu Dock) breaking overview allocations after enabled and changed position
            // DtD replaces dock and its _workId on every position change
            const dash = Ui.Main.overview.dash;
            if (this._prevDash !== dash._workId)
                this._updateVShell(0);
        }
    }

    _updateVShell(timeout = 200) {
        if (!this._enabled || Ui.Main.layoutManager._startingUp)
            return;

        if (this._timeouts.reset)
            Gi.GLib.source_remove(this._timeouts.reset);
        this._timeouts.reset = Gi.GLib.timeout_add(
            Gi.GLib.PRIORITY_DEFAULT,
            timeout,
            () => {
                if (!this._enabled)
                    return Gi.GLib.SOURCE_REMOVE;

                const dash = Ui.Main.overview.dash;
                if (timeout < 2000) { // timeout < 2000 for partial update
                    this._prevDash = dash._workId;
                    log(`[${Me.metadata.name}]: Dash has been replaced, updating extension ...`);
                    Me._resetInProgress = true;
                    // update only necessary modules if dash has been replaced
                    this._repairOverrides();
                    Me._resetInProgress = false;
                } else {
                    log(`[${Me.metadata.name}]: Updating extension ...`);
                    // for case the monitor configuration has been changed, update all
                    Me._resetInProgress = true;
                    this.activateVShell();
                    Me._resetInProgress = false;
                }
                this._timeouts.reset = 0;
                return Gi.GLib.SOURCE_REMOVE;
            }
        );
    }

    // the key modules that can be affected by the supported incompatible extensions
    _repairOverrides() {
        Me.Modules.overviewModule.update();
        Me.Modules.overviewControlsModule.update();
        Me.Modules.layoutModule.update();
        Me.Modules.workspacesViewModule.update();
        Me.Modules.windowPreviewModule.update();
        Me.Modules.panelModule.update();
        Me.Modules.dashModule.update();
        this._updateSettings();
    }

    _updateSettings(settings, key) {
        // update settings cache and option variables
        opt._updateSettings();

        // avoid overload while loading profile - update only once
        // delayed gsettings writes are processed alphabetically
        if (key === 'aaa-loading-profile') {
            this._showStatusMessage();
            if (this._timeouts.loadingProfile)
                Gi.GLib.source_remove(this._timeouts.loadingProfile);
            this._timeouts.loadingProfile = Gi.GLib.timeout_add(
                Gi.GLib.PRIORITY_DEFAULT,
                100, () => {
                    this.activateVShell();
                    this._timeouts.loadingProfile = 0;
                    return Gi.GLib.SOURCE_REMOVE;
                });
        }
        if (this._timeouts.loadingProfile)
            return;

        if (key?.includes('profile-data')) {
            const index = key.replace('profile-data-', '');
            Ui.Main.notify(`${Me.metadata.name}`, `Profile ${index} has been updated`);
        }

        opt.WORKSPACE_MIN_SPACING = Ui.Main.overview._overview._controls._thumbnailsBox.get_theme_node().get_length('spacing');
        // update variables that cannot be processed within settings
        const dash = Ui.Main.overview.dash;
        if (Me.Util.dashIsDashToDock()) {
            opt.DASH_POSITION = dash._position;
            opt.DASH_TOP = opt.DASH_POSITION === 0;
            opt.DASH_RIGHT = opt.DASH_POSITION === 1;
            opt.DASH_BOTTOM = opt.DASH_POSITION === 2;
            opt.DASH_LEFT = opt.DASH_POSITION === 3;
            opt.DASH_VERTICAL = opt.DASH_LEFT || opt.DASH_RIGHT;
        }

        opt.DASH_VISIBLE = opt.DASH_VISIBLE && !Me.Util.getEnabledExtensions('dash-to-panel@jderose9.github.com').length;

        opt.MAX_ICON_SIZE = opt.get('dashMaxIconSize');
        if (opt.MAX_ICON_SIZE < 16) {
            opt.MAX_ICON_SIZE = 64;
            opt.set('dashMaxIconSize', 64);
        }

        const monitorWidth = global.display.get_monitor_geometry(global.display.get_primary_monitor()).width;
        if (monitorWidth < 1600) {
            opt.APP_GRID_ICON_SIZE_DEFAULT = opt.APP_GRID_ACTIVE_PREVIEW && !opt.APP_GRID_USAGE ? 128 : 64;
            opt.APP_GRID_FOLDER_ICON_SIZE_DEFAULT = 64;
        }

        /* if (!Me.Util.dashIsDashToDock()) { // DtD has its own opacity control
            Me.Modules.dashModule.updateStyle(dash);
        }*/

        // adjust search entry style for OM2
        if (opt.OVERVIEW_MODE2)
            Ui.Main.overview.searchEntry.add_style_class_name('search-entry-om2');
        else
            Ui.Main.overview.searchEntry.remove_style_class_name('search-entry-om2');

        if (opt.OVERVIEW_MODE === 1)
            Me.Modules.workspaceModule.setWindowPreviewMaxScale(0.1);
        else
            Me.Modules.workspaceModule.setWindowPreviewMaxScale(0.95);

        Ui.Main.overview.searchEntry.visible = opt.SHOW_SEARCH_ENTRY;
        Ui.Main.overview.searchEntry.opacity = 255;
        Gi.St.Settings.get().slow_down_factor = opt.ANIMATION_TIME_FACTOR;

        opt.START_Y_OFFSET = (opt.get('panelModule') && opt.PANEL_OVERVIEW_ONLY && opt.PANEL_POSITION_TOP) ||
            // better to add unnecessary space than to have a panel overlapping other objects
            Me.Util.getEnabledExtensions('hidetopbar').length
            ? Ui.Main.panel.height
            : 0;

        // Options for workspace switcher, apply custom function only if needed
        if (opt.WS_WRAPAROUND || opt.WS_IGNORE_LAST)
            Gi.Meta.Workspace.prototype.get_neighbor = this._getNeighbor;
        else
            Gi.Meta.Workspace.prototype.get_neighbor = this._originalGetNeighbor;

        if (settings)
            this._applySettings(key);
    }

    _applySettings(key) {
        if (key?.endsWith('-module')) {
            for (let module of this._getModuleList()) {
                if (opt.options[module] && key === opt.options[module][1]) {
                    if (key === 'app-display-module')
                        this._showStatusMessage();
                    Me.Modules[module].update();
                    break;
                }
            }
            return;
        }

        Ui.Main.overview._overview.controls._setBackground();
        this._switchPageShortcuts();

        if (key?.includes('panel'))
            Me.Modules.panelModule.update();

        if (key?.includes('dash') || key?.includes('icon') || key?.includes('dot-style'))
            Me.Modules.dashModule.update();

        if (key?.includes('hot-corner') || key?.includes('dash'))
            Me.Modules.layoutModule.update();

        switch (key) {
        case 'ws-thumbnails-position':
            this._updateOverrides();
            break;
        case 'workspace-switcher-animation':
            Me.Modules.workspaceAnimationModule.update();
            break;
        case 'search-width-scale':
            Me.Modules.searchModule.update();
            break;
        case 'favorites-notify':
            Me.Modules.appFavoritesModule.update();
            break;
        case 'window-attention-mode':
            Me.Modules.windowAttentionHandlerModule.update();
            break;
        case 'show-ws-preview-bg':
            Me.Modules.panelModule.update();
            break;
        case 'notification-position':
            Me.Modules.messageTrayModule.update();
            break;
        case 'osd-position':
            Me.Modules.osdWindowModule.update();
            break;
        case 'overlay-key':
            Me.Modules.overlayKeyModule.update();
            break;
        case 'always-activate-selected-window':
            Me.Modules.windowPreviewModule.update();
            break;
        }

        if (key?.includes('app-grid') ||
            key?.includes('app-folder') ||
            key?.includes('dot-style') ||
            key === 'show-search-entry' ||
            key === 'ws-thumbnail-scale' ||
            key === 'ws-thumbnail-scale-appgrid') {
            this._showStatusMessage();
            Me.Modules.appDisplayModule.update();
        }
    }

    _switchPageShortcuts() {
        //                                          ignore screen lock
        if (!opt.get('enablePageShortcuts') || this._sessionLockActive)
            return;

        const vertical = global.workspaceManager.layout_rows === -1;
        const schema = 'org.gnome.desktop.wm.keybindings';
        const settings = Misc.getSettings(schema);

        const keyLeft = 'switch-to-workspace-left';
        const keyRight = 'switch-to-workspace-right';
        const keyUp = 'switch-to-workspace-up';
        const keyDown = 'switch-to-workspace-down';

        const keyMoveLeft = 'move-to-workspace-left';
        const keyMoveRight = 'move-to-workspace-right';
        const keyMoveUp = 'move-to-workspace-up';
        const keyMoveDown = 'move-to-workspace-down';

        const switchPrevSc = '<Super>Page_Up';
        const switchNextSc = '<Super>Page_Down';
        const movePrevSc = '<Super><Shift>Page_Up';
        const moveNextSc = '<Super><Shift>Page_Down';

        let switchLeft = settings.get_strv(keyLeft);
        let switchRight = settings.get_strv(keyRight);
        let switchUp = settings.get_strv(keyUp);
        let switchDown = settings.get_strv(keyDown);

        let moveLeft = settings.get_strv(keyMoveLeft);
        let moveRight = settings.get_strv(keyMoveRight);
        let moveUp = settings.get_strv(keyMoveUp);
        let moveDown = settings.get_strv(keyMoveDown);

        if (vertical) {
            if (switchLeft.includes(switchPrevSc))
                switchLeft.splice(switchLeft.indexOf(switchPrevSc), 1);
            if (switchRight.includes(switchNextSc))
                switchRight.splice(switchRight.indexOf(switchNextSc), 1);
            if (moveLeft.includes(movePrevSc))
                moveLeft.splice(moveLeft.indexOf(movePrevSc), 1);
            if (moveRight.includes(moveNextSc))
                moveRight.splice(moveRight.indexOf(moveNextSc), 1);

            if (!switchUp.includes(switchPrevSc))
                switchUp.push(switchPrevSc);
            if (!switchDown.includes(switchNextSc))
                switchDown.push(switchNextSc);
            if (!moveUp.includes(movePrevSc))
                moveUp.push(movePrevSc);
            if (!moveDown.includes(moveNextSc))
                moveDown.push(moveNextSc);
        } else {
            if (!switchLeft.includes(switchPrevSc))
                switchLeft.push(switchPrevSc);
            if (!switchRight.includes(switchNextSc))
                switchRight.push(switchNextSc);
            if (!moveLeft.includes(movePrevSc))
                moveLeft.push(movePrevSc);
            if (!moveRight.includes(moveNextSc))
                moveRight.push(moveNextSc);

            if (switchUp.includes(switchPrevSc))
                switchUp.splice(switchUp.indexOf(switchPrevSc), 1);
            if (switchDown.includes(switchNextSc))
                switchDown.splice(switchDown.indexOf(switchNextSc), 1);
            if (moveUp.includes(movePrevSc))
                moveUp.splice(moveUp.indexOf(movePrevSc), 1);
            if (moveDown.includes(moveNextSc))
                moveDown.splice(moveDown.indexOf(moveNextSc), 1);
        }

        settings.set_strv(keyLeft, switchLeft);
        settings.set_strv(keyRight, switchRight);
        settings.set_strv(keyUp, switchUp);
        settings.set_strv(keyDown, switchDown);

        settings.set_strv(keyMoveLeft, moveLeft);
        settings.set_strv(keyMoveRight, moveRight);
        settings.set_strv(keyMoveUp, moveUp);
        settings.set_strv(keyMoveDown, moveDown);
    }

    // Status dialog that appears during updating V-Shell configuration and blocks inputs
    _showStatusMessage(show = true) {
        if ((show && Me._resetInProgress) || Ui.Main.layoutManager._startingUp || !Ui.Main.overview._overview.controls._appDisplay._sortOrderedItemsAlphabetically)
            return;

        if (Me._vShellMessageTimeoutId) {
            Gi.GLib.source_remove(Me._vShellMessageTimeoutId);
            Me._vShellMessageTimeoutId = 0;
        }

        if (Me._vShellStatusMessage && !show) {
            Me._vShellStatusMessage.close();
            Me._vShellStatusMessage.destroy();
            Me._vShellStatusMessage = null;
        }

        if (!show)
            return;

        if (!Me._vShellStatusMessage) {
            const sm = new /* Ui.Main.*/RestartMessage(_('Updating V-Shell...'));
            sm.set_style('background-color: rgba(0,0,0,0.3);');
            sm.open();
            Me._vShellStatusMessage = sm;
        }

        // just for case the message wasn't removed from appDisplay after App Grid realization
        Me._vShellMessageTimeoutId = Gi.GLib.timeout_add_seconds(
            Gi.GLib.PRIORITY_DEFAULT,
            5,
            () => {
                if (Me._vShellStatusMessage) {
                    Me._vShellStatusMessage.close();
                    Me._vShellStatusMessage.destroy();
                    Me._vShellStatusMessage = null;
                    Me._resetInProgress = false;
                }

                Me._vShellMessageTimeoutId = 0;
                return Gi.GLib.SOURCE_REMOVE;
            }
        );
    }

    _getNeighbor(direction) {
        // workspace matrix is supported
        const activeIndex = this.index();
        const ignoreLast = opt.WS_IGNORE_LAST && !Ui.Main.overview._shown ? 1 : 0;
        const wraparound = opt.WS_WRAPAROUND;
        const nWorkspaces = global.workspace_manager.n_workspaces;
        const lastIndex = nWorkspaces - 1 - ignoreLast;
        const rows = global.workspace_manager.layout_rows > -1 ? global.workspace_manager.layout_rows : nWorkspaces;
        const columns = global.workspace_manager.layout_columns > -1 ? global.workspace_manager.layout_columns : nWorkspaces;

        let index = activeIndex;
        let neighborExists;

        if (direction === Gi.Meta.MotionDirection.LEFT) {
            index -= 1;
            const currentRow = Math.floor(activeIndex / columns);
            const indexRow = Math.floor(index / columns);
            neighborExists = index > -1 && indexRow === currentRow;
            if (wraparound && !neighborExists) {
                index = currentRow * columns + columns - 1;
                const maxIndexOnLastRow = lastIndex % columns;
                index = index < (lastIndex - ignoreLast) ? index : currentRow * columns + maxIndexOnLastRow;
            }
        } else if (direction === Gi.Meta.MotionDirection.RIGHT) {
            index += 1;
            const currentRow = Math.floor(activeIndex / columns);
            const indexRow = Math.floor(index / columns);
            neighborExists = index <= lastIndex && indexRow === currentRow;
            if (wraparound && !neighborExists)
                index = currentRow * columns;
        } else if (direction === Gi.Meta.MotionDirection.UP) {
            index -= columns;
            neighborExists = index > -1;
            if (wraparound && !neighborExists) {
                index = rows * columns + index;
                index = index < nWorkspaces - ignoreLast ? index : index - columns;
            }
        } else if (direction === Gi.Meta.MotionDirection.DOWN) {
            index += columns;
            neighborExists = index <= lastIndex;
            if (wraparound && !neighborExists)
                index %= columns;
        }

        return global.workspace_manager.get_workspace_by_index(neighborExists || wraparound ? index : activeIndex);
    }
}

const RestartMessage = GObject.registerClass(
class RestartMessage extends ModalDialog.ModalDialog {
    _init(message) {
        super._init({
            shellReactive: true,
            styleClass: 'restart-message headline',
            shouldFadeIn: false,
            destroyOnClose: true,
        });

        let label = new St.Label({
            text: message,
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.CENTER,
        });

        this.contentLayout.add_child(label);
        this.buttonLayout.hide();
    }
});
