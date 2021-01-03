export const UPDATE_CLIENT = "UPDATE_CLIENT";

interface Client {
  width?: number;
  height?: number;
}

export const setWidth = (props: Client) => {
  return {
    type: UPDATE_CLIENT,
    payload: props,
  };
};
