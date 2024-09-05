import {dartGenerator} from 'blockly/dart';
import {luaGenerator} from 'blockly/lua';
import {pythonGenerator} from 'blockly/python';
import {phpGenerator} from 'blockly/php';

dartGenerator.forBlock['escape_room'] = function(block, generator) {
 return "\n";
};

luaGenerator.forBlock['escape_room'] = function(block, generator) {
    return "\n";
};

pythonGenerator.forBlock['escape_room'] = function(block, generator) {
 return "\n";
};

phpGenerator.forBlock['escape_room'] = function(block, generator) {
    return "\n";
   };

dartGenerator.forBlock['point'] = function(block, generator) {
    return ['\n', dartGenerator.ORDER_NONE];
};

luaGenerator.forBlock['point'] = function(block, generator) {
    return ['\n', luaGenerator.ORDER_NONE];
};

pythonGenerator.forBlock['point'] = function(block, generator) {
    return ['\n', pythonGenerator.ORDER_NONE];
};

phpGenerator.forBlock['point'] = function(block, generator) {
    return ['\n', phpGenerator.ORDER_NONE];
   };