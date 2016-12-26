import React, {PropTypes, PureComponent} from 'react';
import {slice, set} from 'lodash';
import Button from 'focus-components/button';

export default () => {
    return (ComponentToConnect) => {
        class PaginationConnector extends PureComponent {
            constructor(props) {
                super(props);
                this.state = {
                    top: props.top
                };
                this._onClickNext = this._onClickNext.bind(this);
                this._otherAction = this._otherAction.bind(this);
            }
            _onClickNext() {
                const { onClickNext, top, skip, page} = this.props;
                const newTop = this.state.top + page;
                this.setState({
                    top: newTop
                });
                onClickNext(newTop, skip);
            }
            _otherAction(){
              const {otherAction} = this.props;
              window.scrollTo(0,0);
              otherAction({...this.props, ...this.state})
            }
            render() {
                const {top} = this.state;
                const {totalCount, isOtherAction} = this.props;
                return (
                    <div data-focus='list-with-pagination'>
                        <ComponentToConnect {...this.props} />
                        <div data-focus='pagination'>
                          <div data-focus='pagination-indicators'>{top} / {totalCount}</div>
                          <div data-focus='pagination__actions'>
                              {!isOtherAction && <Button data-focus='paginate.show.next' label='focus.application.paginate.show.next' onClick={this._onClickNext} />}
                              {isOtherAction && <Button data-focus='paginate.other.action' label='focus.application.paginate.other.action' onClick={this._otherAction} />}
                          </div>
                        </div>
                        <Button className='tsonga' label='bonjour' />
                    </div>
                );
            }
        }
        PaginationConnector.displayName = 'PaginationConnector';
        PaginationConnector.defaultProps = {
          page : 10,
          skip : 0,
          top : 10,
          otherAction : (params) => console.log("please define a other function for the 'other action'. The passed params are " + JSON.stringify(params)),
          onClickNext : (params) => console.log('please define a function. The passed params are ' + JSON.stringify(params)),
          isOtherAction : false

        }
        PaginationConnector.propTypes = {
          page: PropTypes.number,
          skip: PropTypes.nnumber,
          top: PropTypes.number,
          isOtherAction: PropTypes.bool,
          otherAction: PropTypes.func,
          onClickNext: PropTypes.func.isRequired
        }
        return PaginationConnector;
    }
}