import React from 'react';

export default class MyQuiz extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
  	const props = this.props;

	return(
		{props.questions.map(q => 
	    <tr>
	        <td>
	            <p className="summary">{q.title}</p>
	        </td>
	        <td>
				<a href="javascript:;" className="star">
	            	<i className="glyphicon glyphicon-play"></i>
	            </a>
	        </td> 	
	        <td>
	            <a className="star" href='/EditQuiz/'>
	                <i className="glyphicon glyphicon-pencil"></i>
	            </a>
	        </td>
	        <td>
	            <a href="#" className="delete">
	                <i class="glyphicon glyphicon-remove"></i>
	            </a>
	        </td>
	    </tr>
	)});
  }
}
