import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button } from 'react-native';
import { Card, Icon, Input, Rating } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment  } from '../redux/ActionCreators';


  const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

  const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})


function RenderDish(props) {

    const dish = props.dish;
    
        if (dish != null) {
            return(
                <Card
                    featuredTitle={dish.name}
                    image={{uri: baseUrl + dish.image}}
                >
                <Text style={{margin: 10}}>
                    {dish.description}
                </Text>
                <Icon
                    raised
                    reverse
                    name={ props.favorite ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                />
                <Icon
                    raised
                    reverse
                    name="pencil"
                    type="font-awesome"
                    color="#512DA8"
                    onPress={props.onPressAddComment}
                />
                </Card>
            );
        }
        else {
            return(<View></View>);
        }
}

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 15, alignItems : 'flex-start'}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating
                    imageSize={15}
                    readonly
                    count = {item.rating}
                    ratingCount={5}
                    style={{ paddingVertical: 10 }}
                />
                {/* <Text style={{fontSize: 12}}>{item.rating} Stars</Text> */}
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(item.date)))} </Text>
            </View>
        );
    };
    
    return (
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favorites: [],
            showModal: false,
            author: "",
            comment: "",
            rating: 5
        };
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleModal = () => {
        this.setState({ showModal: !this.state.showModal });
    };

    handleReservation() {
        console.log(JSON.stringify(this.state));
        this.toggleModal();
    }

    ratingCompleted = rating => {
        this.setState({ rating });
    };
    
    handleAuthorInput = author => {
        this.setState({ author });
    };
    
    handleCommentInput = comment => {
        this.setState({ comment });
    }

    resetForm() {
        this.setState({
            showModal: false,
            author: "",
            comment: "",
            rating: 5
        });
    }

    handleComment(dishId) {
        const { rating, author, comment } = this.state;
        this.toggleModal();
        if (author != "" && rating != null && comment != "")
            this.props.postComment(dishId, rating, author, comment);
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                {/* some returns true if found in array */}
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)} 
                    onPressAddComment={this.toggleModal}
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.showModal}
                    // onDismiss={() => this.toggleModal()}
                    // onRequestClose={() => this.toggleModal()}
                >
                    <View style={styles.modal}>
                        <Rating
                        imageSize={30}
                        startingValue={5}
                        showRating
                        onFinishRating={this.ratingCompleted}
                        style={{ paddingVertical: 10 }}
                        />
                        <Input
                        placeholder="Author"
                        onChangeText={this.handleAuthorInput}
                        leftIcon={{ type: "font-awesome", name: "user-o" }}
                        />
                        <Input
                        placeholder="Comment"
                        onChangeText={this.handleCommentInput}
                        leftIcon={{ type: "font-awesome", name: "comment-o" }}
                        />
                        <View style={{ margin: 10 }}>
                            <Button
                                onPress={() => {
                                this.handleComment(dishId);
                                this.resetForm();
                                }}
                                color="#512DA8"
                                title="Submit"
                            />
                        </View>
                        <View style={{ margin: 10 }}>
                            <Button
                                onPress={() => {
                                    this.toggleModal();
                                    this.resetForm();
                                }}
                                color="gray"
                                title="Cancel"
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);


const styles = StyleSheet.create({
    icons: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      flexDirection: "row"
    },
    formRow: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      flexDirection: "row",
      margin: 20
    },
    formLabel: {
      fontSize: 18,
      flex: 2
    },
    formItem: {
      flex: 1
    },
    modal: {
      justifyContent: "center",
      margin: 20
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: "bold",
      backgroundColor: "#512DA8",
      textAlign: "center",
      color: "white",
      marginBottom: 20
    },
    modalText: {
      fontSize: 18,
      margin: 10
    }
  });

