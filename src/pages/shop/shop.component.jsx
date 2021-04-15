import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux'; 

import { updateCollections } from '../../redux/shop/shop.actions'
import { selectCurrentUser } from '../../redux/user/user.selector';
import { createStructuredSelector } from 'reselect';

import CollectionOverview from '../../components/collection-overview/collection-overview.component';
import CollectionPage from '../collection/collection.component';
import WithSpinner from '../../components/with-spinner/with-spinner.component';

import { firestore, convertCollectionsSnapshotToMap } from '../../firebase/firebase.utils';

const CollectionsOveriviewWithSpinner = WithSpinner(CollectionOverview);
const CollectionPageWithSpinner = WithSpinner(CollectionPage);

class ShopPage extends React.Component {
    state = {
        loading: true
    }

    unsubscribeFromSnapshot = null;

    componentDidMount(){
        const {updateCollections} = this.props;

        const collectionRef = firestore.collection('collections');

        collectionRef.onSnapshot(async snapshot => {
            const collectionsMap = convertCollectionsSnapshotToMap(snapshot);
            updateCollections(collectionsMap);
            this.setState({
                loading: false
            })
        })
    }


    render() {
        const {match} = this.props;
        const {loading} = this.state;

        return (
                <div className='shop-page'>
                    <Route exact path={`${match.path}`} render={props => (
                        <CollectionsOveriviewWithSpinner isLoading={loading} {...props} />)
                } 
                    />
                    <Route path={`${match.path}/:collectionId`} render={props => (
                        <CollectionPageWithSpinner isLoading={loading} {...props} />)
                } 
                    />
                </div>
            )
    }
}  

const mapDispatchToProps = dispatch =>({
    updateCollections: (collectionsMap) => dispatch(updateCollections(collectionsMap))
})

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
})

export default connect(mapStateToProps, mapDispatchToProps)(ShopPage);