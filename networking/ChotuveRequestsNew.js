const requestGuido = async function () {
  fetchData = () => {
    console.log('fetchData');

    fetch('https://reactnative.dev/movies.json', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

export default requestGuido;
