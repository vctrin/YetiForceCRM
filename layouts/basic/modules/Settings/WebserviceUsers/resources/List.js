/* {[The file is published on the basis of YetiForce Public License that can be found in the following directory: licenses/License.html]} */
Settings_Vtiger_List_Js('Settings_WebserviceUsers_List_Js', {}, {
	container: false,
	getContainer: function () {
		if (this.container == false) {
			this.container = jQuery('div.contentsDiv');
		}
		return this.container;
	},
	getDeafultDeleteParam: function () {
		return {
			module: app.getModuleName(),
			action: 'DeleteAjax',
			parent: app.getParentModuleName(),
			typeApi: this.getActiveTypeApi()
		};
	},
	getActiveTypeApi: function () {
		return this.getContainer().find('.tabApi.active').data('typeapi');
	},
	getListViewRecords: function (urlParams) {
		var aDeferred = jQuery.Deferred();
		if (typeof urlParams == 'undefined') {
			urlParams = {};
		}
		this.reloadTab().then(
				function (data) {
					aDeferred.resolve(data);
				},
				function (textStatus, errorThrown) {
					aDeferred.reject(textStatus, errorThrown);
				});
		return aDeferred.promise();
	},
	updatePagination: function (pageNumber) {
		pageNumber = typeof pageNumber !== 'undefined' ? pageNumber : 1;
		var thisInstance = this;
		var cvId = thisInstance.getCurrentCvId();
		var params = {};
		params['module'] = app.getModuleName();
		if ('Settings' == app.getParentModuleName())
			params['parent'] = 'Settings';
		params['view'] = 'Pagination';
		params['viewname'] = cvId;
		params['page'] = pageNumber;
		params['mode'] = 'getPagination';
		params['sourceModule'] = jQuery('#moduleFilter').val();
		params['totalCount'] = $('.pagination').data('totalCount');
		params['typeApi'] = this.getActiveTypeApi();
		var searchInstance = this.getListSearchInstance();
		if (searchInstance !== false) {
			var searchValue = searchInstance.getAlphabetSearchValue();
			params.search_params = JSON.stringify(this.getListSearchInstance().getListSearchParams());
			if ((typeof searchValue != "undefined") && (searchValue.length > 0)) {
				params['search_key'] = this.getListSearchInstance().getAlphabetSearchField();
				params['search_value'] = searchValue;
				params['operator'] = 's';
			}
		}
		params['noOfEntries'] = jQuery('#noOfEntries').val();
		AppConnector.request(params).then(function (data) {
			jQuery('.paginationDiv').html(data);
			thisInstance.registerPageNavigationEvents();

		});
	},
	reloadTab: function (typeApi) {
		var thisInstance = this;
		var aDeferred = jQuery.Deferred();
		if (typeApi == undefined) {
			typeApi = this.getActiveTypeApi();
		}
		var tabContainer = this.getContainer().find('.listViewContent');
		var params = {
			module: app.getModuleName(),
			parent: app.getParentModuleName(),
			view: app.getViewName(),
			typeApi: typeApi
		}
		AppConnector.request(params).then(
				function (data) {
					tabContainer.html(data);
					Vtiger_Header_Js.getInstance().registerFooTable();
				},
				function (textStatus, errorThrown) {
					app.errorLog(textStatus, errorThrown);
				}
		);
		return aDeferred.promise();
	},
	registerEvents: function () {
		var thisInstance = this;
		this._super();
		this.getContainer().find('li.tabApi').on('click', function (e) {
			thisInstance.reloadTab(jQuery(this).data('typeapi'));
		})
	}
})
