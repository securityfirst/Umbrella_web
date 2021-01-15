import React from "react";
import marked from "marked";

class Marked extends React.Component {
  render() {
    const { content } = this.props;

    if (!content) return <div></div>;

    return (
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: marked(content) }}
      />
    );
  }
}

export default Marked;
