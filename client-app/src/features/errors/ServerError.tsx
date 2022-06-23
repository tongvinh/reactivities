import { observer } from "mobx-react-lite";
import React from "react";
import { Container, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";

export default observer(function ServerError() {
  const { commonStore } = useStore();
  if (commonStore.error !== null) {
    return (
      <Container>
        <Header as="h1" content="Server Error" />
        <Header sub as="h5" color="red" content={commonStore.error.message} />
        {commonStore.error.detail && (
          <Segment>
            <Header as="h4" content="Stack trace" color="teal" />
            {
              <code style={{ marginTop: "10px" }}>
                {commonStore.error.detail}
              </code>
            }
          </Segment>
        )}
      </Container>
    );
  } else {
    return <Container></Container>;
  }
});
