import React, {Component, PropTypes} from 'react';
import {connect as connectToState} from 'react-redux';
import {compose} from 'redux';
import {map} from 'lodash/map';
import isArray from 'lodash/isArray';
import {loadLine} from '../actions/single-action-creator';
import get from 'lodash/get';

const SEARCH_CONTEXT_TYPE = {
  searchMetadata: PropTypes.object
};

// Maybe this function should take the facets and the selectedFacets only.
export function facetListWithselectedInformation(state) {
  const selectedFacets = state.criteria.selectedFacets || [];
  const facets = state.results.facets || [];
  // TODO: Check the selected value presence
  return {
    facetListWithselectedInformation : facets.map(facetDescriptor => (selectedFacets[facetDescriptor.code]) ?
                      {...facetDescriptor,selectedFacets: selectedFacets[facetDescriptor.code], selected: true} : facetDescriptor) ,
    selectedFacetsList :  selectedFacets
  }
}

export function getResultsForGroup(groups, searchMetadata){
   return groups.map(element => {
     // TODO: searchMetadataProvider => getListMetadata in data, and get sorts and groups function from data and facets
     // getListMetadata => LineComponent , ListComponent and maybe other informations concidered usefull
     const {LineComponent, sortList, groupList,actionsLine} = searchMetadata.getListMetadata( element.listType, element.values)
     return {
       listType: element.listType,
       values: element.values.map(machin => {return { fields: Object.keys(machin).map(truc => {return {entityPath: element.listType, label: truc, formattedValue: machin[truc]}})}} ),
       LineComponent,
       actionsLine,
       sortList,
       groupList
     }
  })
}

export function getResultsForList(list = { list: [], listType: "" }, searchMetadata, listType){
  const test = listType
  const {LineComponent, sortList, groupList, actionsLine} = searchMetadata.getListMetadata( list ? list.listType : '', list.list)
  return {
    values: list.values.map(element => {return { fields: Object.keys(element).map(truc => {return {entityPath: test, label: truc, formattedValue: element[truc]}})}} ),
   groupList,
   actionsLine,
   sortList,
   LineComponent
 }

}

export function connect(searchOptions) {
  const {unitSearch: {updateSort, updateGroup, updateSelectedFacets, updateQuery, startSearch}} = searchOptions;
  return function getSearchConnectedComponent(ComponentToConnect){
    function SearchConnectedComponent(props, context){
      const {searchMetadata} = context;
      const {dispatch, results: {hasGroups, data, listType, totalCount}, criteria} = props;
      const scope = get(criteria, 'query.scope', searchMetadata.scopes.find(scope => scope.selected === true).value);
      const unitSearchDispatch = {
        start: element => dispatch(startSearch()),
        sort: element => dispatch(updateSort(element)),
        group: (element, replace) => dispatch(updateGroup(element, replace)),
        facet: (element, replace) => dispatch(updateSelectedFacets(element, replace)),
        query: element => dispatch(updateQuery(element)),
        scopeFunction: (element, replace) => { dispatch(updateQuery(element.query.value, element.query.replace));
                      dispatch(updateGroup(element.group.value, element.group.replace));
                      dispatch(updateSelectedFacets(null, true))}
      }
      const results = hasGroups ? getResultsForGroup(data, searchMetadata) : getResultsForList(data, searchMetadata, listType);
      const facetInformations = facetListWithselectedInformation(props)
      results.totalCount = totalCount;
      return <ComponentToConnect
                isGroup={hasGroups}
                scope={scope}
                scopes={searchMetadata.scopes}
                valuesForResults={results}
                selectedFacetsList={facetInformations.selectedFacetsList}
                facetListWithselectedInformation={facetInformations.facetListWithselectedInformation}
                unitSearchDispatch={unitSearchDispatch} />
    }
    SearchConnectedComponent.displayName= 'SearchConnectedComponent';
    SearchConnectedComponent.contextTypes = SEARCH_CONTEXT_TYPE;
    SearchConnectedComponent.PropTypes = {
      results : PropTypes.shape({
        data: PropTypes.object,
        listType: PropTypes.string
      }).isRequired,

    }
    SearchConnectedComponent.defaultProps = {
      results : "test"
    }
    return compose (
      connectToState(s=> s[searchOptions.searchName])
    )(SearchConnectedComponent);
  }
}

// Usage and example
class SearchProvider extends Component {
    getChildContext() {
        return {
          searchMetadata : this.props.searchMetadata
        };
    }
    render() {
        return this.props.children;
    }
}

SearchProvider.childContextTypes = SEARCH_CONTEXT_TYPE;
SearchProvider.propTypes = {
    searchMetadata: PropTypes.object.isRequired // Add a shape
};




export const Provider = SearchProvider;
