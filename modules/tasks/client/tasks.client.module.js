'use strict';

ApplicationConfiguration.registerModule('tasks', ['core']);
ApplicationConfiguration.registerModule('tasks.admin', ['core.admin']);
ApplicationConfiguration.registerModule('tasks.admin.routes', ['core.admin.routes']);