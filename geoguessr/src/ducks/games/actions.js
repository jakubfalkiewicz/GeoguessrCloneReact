import types from "./types";
import axios from "axios";

export const getGamesListAction = (games) => ({
  type: types.GET_GAMES_LIST,
  payload: games,
});

export const filterGamesListAction = (games) => ({
  type: types.GAME_LIST_FILTER,
  payload: games,
});

export const createGameAction = (game) => ({
  type: types.GAME_CREATE,
  payload: game,
});

export const editGameAction = (game) => ({
  type: types.GAME_EDIT,
  payload: game,
});

export const deleteGameAction = (game) => ({
  type: types.GAME_DELETE,
  payload: game,
});

export const sortGamesListAction = (games) => ({
  type: types.GAME_LIST_SORT,
  payload: games,
});

export const getGamesList = () => {
  return async (dispatch) => {
    const response = await axios.get("http://localhost:5000/api/persons/");
    const games = response.data;
    dispatch(getGamesListAction(games));
  };
};

export const createGame = (game) => {
  return async (dispatch) => {
    axios({
      method: "post",
      url: "https://mongodb-api.onrender.com/games",
      data: game,
    })
      .then((response) => {
        console.log(response.data);
        dispatch(createGameAction(response.data));
      })
      .catch((error) => console.log(error));
  };
};

export const editGame = (game) => {
  console.log(game);
  return async (dispatch) => {
    axios({
      method: "put",
      url: `https://mongodb-api.onrender.com/games/${game.id}`,
      data: game,
    })
      .then((response) => {
        dispatch(editGameAction(response.data));
      })
      .catch((error) => console.log(error));
  };
};

export const deleteGame = (game) => {
  console.log(game);
  return async (dispatch) => {
    const response = await axios.delete(
      `http://localhost:5000/api/persons/${game.id}`
    );
    const gameToDelete = response.data;
    dispatch(deleteGameAction(gameToDelete));
  };
};
