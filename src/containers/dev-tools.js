import React from 'react';

// Exported from redux-devtools
import { createDevTools } from 'redux-devtools';

// Monitors are separate packages, and you can make a custom one
import DockMonitor from 'redux-devtools-dock-monitor';
import MultipleMonitors from 'redux-devtools-multiple-monitors';
import Inspector from 'redux-devtools-inspector';
import Dispatcher from 'redux-devtools-dispatch';

import * as projectActions from '../actions/user-actions';

// createDevTools takes a monitor and produces a DevTools component
const DevTools = createDevTools(
    // Monitors are individually adjustable with props.
    // Consult their repositories to learn about those props.
    // Here, we put LogMonitor inside a DockMonitor.
    <DockMonitor toggleVisibilityKey='ctrl-m' changePositionKey='ctrl-q' defaultSize={0.4} defaultIsVisible={true}>
        <MultipleMonitors>
            <Inspector />
            <Dispatcher actionCreators={{...projectActions}} />
        </MultipleMonitors>
    </DockMonitor>
);

export default DevTools;
