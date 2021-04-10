import React, { useMemo, useState, useCallback } from 'react';
import { createEditor, Transforms, Text } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import './App.css';

const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
var commnetsJSON = JSON.parse(localStorage.getItem('storedComment')) || [
  {highlight: '#00f',
   comment: 'Your Comments go here!'
  },
]


var color = '';

const Commenter = ()  => {
  const [comments, setComments] = useState(JSON.parse(localStorage.getItem('storedComment')) || commnetsJSON);
  const [counter, setCounter] = useState(0);
  console.log("Inside Commenter");  
  console.log(comments);

  const CommenterInput = () => {
  const [text, setText] = useState('')
  
    
    if(color){
    console.log('Inside Commenter Input');
   
      return  <div>
        <div 
          clsss='color-sq' 
          style = {{backgroundColor: color, display:'inline-flex', height:'20px', width: '20px', margin: '2.5%', borderRadius:'50%', justifyContent: 'center', alignItems:'center'}}>  
          </div>
          <input 
          style={{height:'100px', width: '300px'}} 
          onChange = {event => {
            setText(event.target.value);
          }} 
          />
              <button 
              style = {{backgroundColor: color, height: '50px', width: '100px', marginTop: '5px', marginLeft:'40%', borderRadius:'22px'}} 
              onClick = {(event)=>{ 
                commnetsJSON.push({highlight: color, comment: text});
                const storedComment = JSON.stringify(commnetsJSON);
                localStorage.setItem('storedComment', storedComment);
                setCounter(counter+1);
                setComments(commnetsJSON);
                
            }
              }
              >
                COMMENT
                </button>
    </div>
  }
  else { return null;}
  }

 return <div>
      <CommenterInput />
      {comments.map(person => (
        <div>
          <div 
          clsss='color-sq' 
          style = {{backgroundColor: person.highlight, display:'inline-flex', height:'20px', width: '20px', margin: '2.5%', borderRadius:'50%'}}>  
          </div>
          <p class = 'comment' key={person.highlight}>{person.comment}</p>
        </div>
      ))}
    </div>
}


const App = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState(JSON.parse(localStorage.getItem('content')) || [
    {
      type: 'paragraph',
      children: [{ text: 'The most outstanding monument built by Emperor Shahjahan is the Taj Mahal at Agra. It is on the bank of River Yamuna. This grand mausoleum was built in the memory of his beloved Queen Mumtaj Mahal. It has been described as “a dream in marble designed by fairies and completed by jewelers.” It is made of pure white marble. As a monument of love “it is unsurpassed in the world.” It stands on a platform of 8.5 meters height. The mausoleum rises to a height of 32.4 meters. It is surmounted by cupolas at each corner. The bulbous dome in the centre of the cupolas has the ap pearance of an inverted lotus. There are four smaller domes at the four corners of the building. Four minarets stand at each corner of the terrace. The outer walls and the interior walls are richly decorated with exquisite inlay work and calligraphy.'}],
    },
  ]);


  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, []);

  return (
    <div class = 'shunya'>
      <h3>For the Evaluators: To comment on a part of text - Select it and press Ctrl + Q. Data is currently being stored in Local Storage of your system.</h3>
    <div class = 'write'>
    <Slate editor={editor} value={value} onChange={value => {
      setValue(value);
      const content = JSON.stringify(value);
      localStorage.setItem('content', content);
      }}>
      <Editable
        
        class = {'edit'}
        renderLeaf={renderLeaf}
        onKeyDown={event => {
          if (!event.ctrlKey) {
            return
          }

          switch (event.key) {
            

            case 'q': {
              event.preventDefault()
              Transforms.setNodes(
                editor,
                { backgroundColor: getRandomColor() },
                { match: n => Text.isText(n), split: true }
              )
              break
            }
          }
        }}
      />
    </Slate>
    </div>
    
    <div class='section1'>
      <div class = "bar"> <p>Comments</p> </div>
      <br />
      <div class = 'showAll'>
        <Commenter />
      </div>
    
    </div>
   
    </div>
  )
}


const Leaf = (props) => {
  console.log(props);
  try{
  if(props.leaf.backgroundColor){
    
    console.log("Inside If");
    var temp = props.leaf.backgroundColor;
    var flag = 0;
    for(var i=0; i< commnetsJSON.length; i++){
      if(commnetsJSON[i].highlight===temp)
      {
        flag = 1;
        break;
      }
    }
      if(flag===0)
        color = temp;
    
    return (<span
      {...props.attributes}
      style={{ backgroundColor:  props.leaf.backgroundColor}}
    >
      {props.children}
     
    </span>)
    }

  else{
  return (
    <span
      {...props.attributes}
      style={{ backgroundColor: props.leaf.backgroundColor? props.leaf.backgroundColor: '#fff' }}
    >
      {props.children}
    </span>
  )}
}
catch (err) {
  console.log(err);
}
 
}

export default App;
