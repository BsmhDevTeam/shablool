import React from 'react';

const TagTemplate = (props) => {
  const remove = (event) => {
    event.preventDefault();
    this.removeTag();
  };
  return (
    <h2 className="pull-right">
        <span className="label label-info">
          { props.tag.name }
        <span className="remove-tag glyphicon glyphicon-remove clickable" aria-hidden="true" onClick={remove}></span>
        </span>
    </h2>
  );
};

export default TagTemplate;
