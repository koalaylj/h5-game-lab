var __extends = (this && this.__extends) || (function() {
  var extendStatics = Object.setPrototypeOf ||
    ({
        __proto__: []
      }
      instanceof Array && function(d, b) {
        d.__proto__ = b;
      }) ||
    function(d, b) {
      for (var p in b)
        if (b.hasOwnProperty(p)) d[p] = b[p];
    };
  return function(d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();

// //HACK TO FIX NULL TEXTURE
// PIXI.Sprite.prototype.setTexture = function(texture, destroyBase) {
//   if (destroyBase !== undefined) {
//     this.texture.baseTexture.destroy();
//   }
//   //  Over-ridden by loadTexture as needed
//   this.texture = texture;
//   this.texture.baseTexture.skipRender = false;
//   this.texture.valid = true;
//   this.cachedTint = -1;
// };
// //HACK TO MAKE BOUNDRY BOX SCALE TO ANIMATION SIZE (if used)
// PIXI.Sprite.prototype.getBounds = function(targetCoordinateSpace) {
//   var isTargetCoordinateSpaceDisplayObject = (targetCoordinateSpace && targetCoordinateSpace instanceof PIXI.DisplayObject);
//   var isTargetCoordinateSpaceThisOrParent = true;
//   if (!isTargetCoordinateSpaceDisplayObject) {
//     targetCoordinateSpace = this;
//   } else if (targetCoordinateSpace instanceof PIXI.DisplayObjectContainer) {
//     isTargetCoordinateSpaceThisOrParent = targetCoordinateSpace.contains(this);
//   } else {
//     isTargetCoordinateSpaceThisOrParent = false;
//   }
//   var i;
//   if (isTargetCoordinateSpaceDisplayObject) {
//     var matrixCache = targetCoordinateSpace.worldTransform;
//     targetCoordinateSpace.worldTransform = PIXI.identityMatrix;
//     for (i = 0; i < targetCoordinateSpace.children.length; i++) {
//       targetCoordinateSpace.children[i].updateTransform();
//     }
//   }
//   var minX = Infinity;
//   var minY = Infinity;
//   var maxX = -Infinity;
//   var maxY = -Infinity;
//   var childBounds;
//   var childMaxX;
//   var childMaxY;
//   var childVisible = false;
//   for (i = 0; i < this.children.length; i++) {
//     var child = this.children[i];
//     if (!child.visible) {
//       continue;
//     }
//     childVisible = true;
//     childBounds = this.children[i].getBounds();
//     minX = (minX < childBounds.x) ? minX : childBounds.x;
//     minY = (minY < childBounds.y) ? minY : childBounds.y;
//     childMaxX = childBounds.width + childBounds.x;
//     childMaxY = childBounds.height + childBounds.y;
//     maxX = (maxX > childMaxX) ? maxX : childMaxX;
//     maxY = (maxY > childMaxY) ? maxY : childMaxY;
//   }
//   var bounds = this._bounds;
//   if (!childVisible) {
//     bounds = new PIXI.Rectangle();
//     var w0 = bounds.x;
//     var w1 = bounds.width + bounds.x;
//     var h0 = bounds.y;
//     var h1 = bounds.height + bounds.y;
//     var worldTransform = this.worldTransform;
//     var a = worldTransform.a;
//     var b = worldTransform.b;
//     var c = worldTransform.c;
//     var d = worldTransform.d;
//     var tx = worldTransform.tx;
//     var ty = worldTransform.ty;
//     var x1 = a * w1 + c * h1 + tx;
//     var y1 = d * h1 + b * w1 + ty;
//     var x2 = a * w0 + c * h1 + tx;
//     var y2 = d * h1 + b * w0 + ty;
//     var x3 = a * w0 + c * h0 + tx;
//     var y3 = d * h0 + b * w0 + ty;
//     var x4 = a * w1 + c * h0 + tx;
//     var y4 = d * h0 + b * w1 + ty;
//     maxX = x1;
//     maxY = y1;
//     minX = x1;
//     minY = y1;
//     minX = x2 < minX ? x2 : minX;
//     minX = x3 < minX ? x3 : minX;
//     minX = x4 < minX ? x4 : minX;
//     minY = y2 < minY ? y2 : minY;
//     minY = y3 < minY ? y3 : minY;
//     minY = y4 < minY ? y4 : minY;
//     maxX = x2 > maxX ? x2 : maxX;
//     maxX = x3 > maxX ? x3 : maxX;
//     maxX = x4 > maxX ? x4 : maxX;
//     maxY = y2 > maxY ? y2 : maxY;
//     maxY = y3 > maxY ? y3 : maxY;
//     maxY = y4 > maxY ? y4 : maxY;
//   }
//   bounds.x = minX;
//   bounds.y = minY;
//   bounds.width = maxX - minX;
//   bounds.height = maxY - minY;
//   if (isTargetCoordinateSpaceDisplayObject) {
//     targetCoordinateSpace.worldTransform = matrixCache;
//     for (i = 0; i < targetCoordinateSpace.children.length; i++) {
//       targetCoordinateSpace.children[i].updateTransform();
//     }
//   }
//   if (!isTargetCoordinateSpaceThisOrParent) {
//     var targetCoordinateSpaceBounds = targetCoordinateSpace.getBounds();
//     bounds.x -= targetCoordinateSpaceBounds.x;
//     bounds.y -= targetCoordinateSpaceBounds.y;
//   }
//   return bounds;
// };


(function(dragonBones) {

  /**
   * TextureAtlasData
   */
  var PhaserTextureAtlasData = (function(_super) {
    __extends(PhaserTextureAtlasData, _super);

    function PhaserTextureAtlasData() {
      this._renderTexture = null;
      return _super.apply(this, arguments) || this;
    }
    PhaserTextureAtlasData.toString = function() {
      return "[class dragonBones.PhaserTextureAtlasData]";
    };
    PhaserTextureAtlasData.prototype._onClear = function() {
      _super.prototype._onClear.call(this);
      if (this._renderTexture) {
        this._renderTexture = null;
      }
    };
    PhaserTextureAtlasData.prototype.createTexture = function() {
      return dragonBones.BaseObject.borrowObject(PhaserTextureData);
    };

    Object.defineProperty(PhaserTextureAtlasData.prototype, "renderTexture", {
      get: function() {
        return this._renderTexture;
      },
      set: function(value) {
        if (this._renderTexture === value) {
          return;
        }
        this._renderTexture = value;
        if (this._renderTexture !== null) {
          for (var k in this.textures) {
            var textureData = this.textures[k];
            textureData.renderTexture = new PIXI.Texture(
              this._renderTexture,
              textureData.region, // No need to set frame.
              textureData.region,
              new PIXI.Rectangle(0, 0, textureData.region.width, textureData.region.height),
              textureData.rotated
            );
          }
        } else {
          for (var k in this.textures) {
            var textureData = this.textures[k];
            textureData.renderTexture = null;
          }
        }
      },
      enumerable: true,
      configurable: true
    });

    return PhaserTextureAtlasData;
  }(dragonBones.TextureAtlasData));
  dragonBones.PhaserTextureAtlasData = PhaserTextureAtlasData;

  /**
   * TextureData
   */
  var PhaserTextureData = (function(_super) {
    __extends(PhaserTextureData, _super);

    function PhaserTextureData() {
      this.renderTexture = null;
      return _super.call(this) || this;
    }
    PhaserTextureData.toString = function() {
      return "[class dragonBones.PhaserTextureData]";
    };

    PhaserTextureData.prototype._onClear = function() {
      _super.prototype._onClear.call(this);
      if (this.renderTexture) {
        this.renderTexture.destroy();
        this.renderTexture = null;
      }
    };
    return PhaserTextureData;
  }(dragonBones.TextureData));
  dragonBones.PhaserTextureData = PhaserTextureData;

  /**
   * ArmatureDisplay
   */
  var PhaserArmatureDisplay = (function(_super) {
    __extends(PhaserArmatureDisplay, _super);

    function PhaserArmatureDisplay(game) {
      var _this = _super.call(this, game, 0, 0, 0) || this;
      // _this.maxX = 0;
      // _this.maxY = 0;
      _this.game = game;

      _this._debugDraw = false;
      _this._armature = null; //
      _this._debugDrawer = null;

      return _this;
    }

    PhaserArmatureDisplay.prototype.dbInit = function(armature) {
      this._armature = armature;
    };

    PhaserArmatureDisplay.prototype.dbClear = function() {
      if (this._debugDrawer) {
        this._debugDrawer.destroy(true);
      }
      this._armature = null;
      this._debugDrawer = null;
      _super.prototype.destroy.call(this);
    };

    // PhaserArmatureDisplay.prototype.SetBounds = function(force) {
    //   if (force || this.maxX < this.getBounds().width)
    //     this.maxX = this.getBounds().width;
    //   if (force || this.maxY < this.getBounds().height)
    //     this.maxY = this.getBounds().height;
    //   this.body.setSize(this.maxX / 2, this.maxX / 2, this.maxY, 0);
    // };

    // PhaserArmatureDisplay.prototype._onClear = function() {
    //   this._armature = null;
    //   if (this._debugDrawer) {
    //     this._debugDrawer.destroy(true);
    //     this._debugDrawer = null;
    //   }
    //   this.destroy(true);
    // };

    PhaserArmatureDisplay.prototype.destroy = function() {
      this.dispose();
    };

    PhaserArmatureDisplay.prototype.dbUpdate = function() {
      var drawed = dragonBones.DragonBones.debugDraw;
      if (drawed || this._debugDraw) {
        this._debugDraw = drawed;
        if (this._debugDraw) {
          if (this._debugDrawer === null) {
            this._debugDrawer = new Phaser.Graphics(this.game);
          }
          this.addChild(this._debugDrawer);
          this._debugDrawer.clear();

          var bones = this._armature.getBones();
          for (var i = 0, l = bones.length; i < l; ++i) {
            var bone = bones[i];
            var boneLength = bone.boneData.length;
            var startX = bone.globalTransformMatrix.tx;
            var startY = bone.globalTransformMatrix.ty;
            var endX = startX + bone.globalTransformMatrix.a * boneLength;
            var endY = startY + bone.globalTransformMatrix.b * boneLength;

            this._debugDrawer.lineStyle(1, bone.ik ? 0xFF0000 : 0x00FF00, 0.5);
            this._debugDrawer.moveTo(startX, startY);
            this._debugDrawer.lineTo(endX, endY);

            this._debugDrawer.lineStyle(0.0, 0, 0.0);
            this._debugDrawer.beginFill(0x00FFFF, 0.7);
            this._debugDrawer.drawCircle(startX, startY, 3.0);
            this._debugDrawer.endFill();
          }

          var slots = this._armature.getSlots();
          for (var i = 0, l = slots.length; i < l; ++i) {
            var slot = slots[i];
            var boundingBoxData = slot.boundingBoxData;
            if (boundingBoxData) {
              var child = this._debugDrawer.getChildByName(slot.name);
              if (!child) {
                child = new new Phaser.Graphics(this.game);
                child.name = slot.name;
                this._debugDrawer.addChild(child);
              }
              child.clear();
              child.beginFill(0xFF00FF, 0.3);
              switch (boundingBoxData.type) {
                case 0 /* Rectangle */ :
                  child.drawRect(-boundingBoxData.width * 0.5, -boundingBoxData.height * 0.5, boundingBoxData.width, boundingBoxData.height);
                  break;
                case 1 /* Ellipse */ :
                  child.drawEllipse(-boundingBoxData.width * 0.5, -boundingBoxData.height * 0.5, boundingBoxData.width, boundingBoxData.height);
                  break;
                case 2 /* Polygon */ :
                  var vertices = boundingBoxData.vertices;
                  for (var i_4 = 0, l_1 = vertices.length; i_4 < l_1; i_4 += 2) {
                    if (i_4 === 0) {
                      child.moveTo(vertices[i_4], vertices[i_4 + 1]);
                    } else {
                      child.lineTo(vertices[i_4], vertices[i_4 + 1]);
                    }
                  }
                  break;
                default:
                  break;
              }
              child.endFill();
              slot.updateTransformAndMatrix();
              slot.updateGlobalTransform();
              var transform = slot.global;
              child.setTransform(transform.x, transform.y, transform.scaleX, transform.scaleY, transform.rotation, transform.skew, 0.0, slot._pivotX, slot._pivotY);
            } else {
              var child = this._debugDrawer.getChildByName(slot.name);
              if (child) {
                this._debugDrawer.removeChild(child);
              }
            }
          }
        } else if (this._debugDrawer && this._debugDrawer.parent === this) {
          this.removeChild(this._debugDrawer);
        }
      }
    };

    PhaserArmatureDisplay.prototype.dispose = function() {
      if (this._armature) {
        // this.advanceTimeBySelf(false); //todo why deprecated?
        this._armature.dispose();
        this._armature = null;
      }
    };

    PhaserArmatureDisplay.prototype.hasEvent = function(type) {
      // return this.listeners(type, true);
      return false;
    };

    PhaserArmatureDisplay.prototype.addEvent = function(type, listener, target) {
      // this.addListener(type, listener, target);
    };

    PhaserArmatureDisplay.prototype.removeEvent = function(type, listener, target) {
      // this.removeListener(type, listener, target);
    };

    //TODO
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.Armature#clock
     * @see dragonBones.PixiFactory#clock
     * @see dragonBones.Animation#timescale
     * @see dragonBones.Animation#stop()
     */
    PhaserArmatureDisplay.prototype.advanceTimeBySelf = function(on) {
      if (on) {
        dragonBones.PhaserFactory._clock.add(this._armature);
      } else {
        dragonBones.PhaserFactory._clock.remove(this._armature);
      }
    };

    Object.defineProperty(PhaserArmatureDisplay.prototype, "armature", {

      get: function() {
        return this._armature;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(PhaserArmatureDisplay.prototype, "animation", {

      get: function() {
        return this._armature.animation;
      },
      enumerable: true,
      configurable: true
    });
    return PhaserArmatureDisplay;
  }(Phaser.Sprite));
  dragonBones.PhaserArmatureDisplay = PhaserArmatureDisplay;

  /**
   * Slot 插槽
   */
  var PhaserSlot = (function(_super) {
    __extends(PhaserSlot, _super);

    function PhaserSlot() {
      return _super.call(this) || this;
    }

    PhaserSlot.toString = function() {
      return "[class dragonBones.PhaserSlot]";
    };

    PhaserSlot.prototype._initDisplay = function(value) {};

    PhaserSlot.prototype._disposeDisplay = function(value) {
      value.destroy();
    };

    PhaserSlot.prototype._onUpdateDisplay = function() {
      this._renderDisplay = (this._display || this._rawDisplay);
    };

    // PhaserSlot.prototype.set_game = function() {};

    PhaserSlot.prototype._onClear = function() {
      _super.prototype._onClear.call(this);
      //TODO
      // this._updateTransform = PIXI.VERSION[0] === "3" ? this._updateTransformV3 : this._updateTransformV4;
      this._renderDisplay = null;
    };

    PhaserSlot.prototype._addDisplay = function() {
      var container = this._armature._display;
      container.addChild(this._renderDisplay);
    };

    PhaserSlot.prototype._replaceDisplay = function(value) {
      var container = this._armature._display;
      var prevDisplay = value;
      container.addChild(this._renderDisplay);
      container.swapChildren(this._renderDisplay, prevDisplay);
      container.removeChild(prevDisplay);
    };

    PhaserSlot.prototype._removeDisplay = function() {
      this._renderDisplay.parent.removeChild(this._renderDisplay);
    };

    PhaserSlot.prototype._updateZOrder = function() {
      var container = this._armature.display;
      var index = container.getChildIndex(this._renderDisplay);
      if (index === this._zOrder) {
        return;
      }
      container.addChildAt(this._renderDisplay, this._zOrder);
    };

    PhaserSlot.prototype._updateVisible = function() {
      this._renderDisplay.visible = this._parent.visible;
    };

    PhaserSlot.prototype._updateBlendMode = function() {
      // if (this._renderDisplay instanceof PIXI.Sprite) {
      //   switch (this._blendMode) {
      //     case 0 /* Normal */ :
      //       this._renderDisplay.blendMode = PIXI.BLEND_MODES.NORMAL;
      //       break;
      //     case 1 /* Add */ :
      //       this._renderDisplay.blendMode = PIXI.BLEND_MODES.ADD;
      //       break;
      //     case 3 /* Darken */ :
      //       this._renderDisplay.blendMode = PIXI.BLEND_MODES.DARKEN;
      //       break;
      //     case 4 /* Difference */ :
      //       this._renderDisplay.blendMode = PIXI.BLEND_MODES.DIFFERENCE;
      //       break;
      //     case 6 /* HardLight */ :
      //       this._renderDisplay.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;
      //       break;
      //     case 9 /* Lighten */ :
      //       this._renderDisplay.blendMode = PIXI.BLEND_MODES.LIGHTEN;
      //       break;
      //     case 10 /* Multiply */ :
      //       this._renderDisplay.blendMode = PIXI.BLEND_MODES.MULTIPLY;
      //       break;
      //     case 11 /* Overlay */ :
      //       this._renderDisplay.blendMode = PIXI.BLEND_MODES.OVERLAY;
      //       break;
      //     case 12 /* Screen */ :
      //       this._renderDisplay.blendMode = PIXI.BLEND_MODES.SCREEN;
      //       break;
      //     default:
      //       break;
      //   }
      // }
    };

    PhaserSlot.prototype._updateColor = function() {
      this._renderDisplay.alpha = this._colorTransform.alphaMultiplier;
      if (this._renderDisplay instanceof PIXI.Sprite || this._renderDisplay instanceof PIXI.mesh.Mesh) {
        var color = (Math.round(this._colorTransform.redMultiplier * 0xFF) << 16) + (Math.round(this._colorTransform.greenMultiplier * 0xFF) << 8) + Math.round(this._colorTransform.blueMultiplier * 0xFF);
        this._renderDisplay.tint = color;
      }
    };

    //PhaserSlot.prototype._updateFilters = function() {};

    PhaserSlot.prototype._updateFrame = function() {

      var meshData = this._display === this._meshDisplay ? this._meshData : null;
      var currentTextureData = this._textureData;
      if (this._displayIndex >= 0 && this._display !== null && currentTextureData !== null) {
        var currentTextureAtlasData = currentTextureData.parent;
        if (this._armature.replacedTexture !== null && this._rawDisplayDatas.indexOf(this._displayData) >= 0) {
          if (this._armature._replaceTextureAtlasData === null) {
            currentTextureAtlasData = dragonBones.BaseObject.borrowObject(dragonBones.PhaserTextureAtlasData);
            currentTextureAtlasData.copyFrom(currentTextureData.parent);
            currentTextureAtlasData.renderTexture = this._armature.replacedTexture;
            this._armature._replaceTextureAtlasData = currentTextureAtlasData;
          } else {
            currentTextureAtlasData = this._armature._replaceTextureAtlasData;
          }
          currentTextureData = currentTextureAtlasData.getTexture(currentTextureData.name);
        }
        var renderTexture = currentTextureData.renderTexture;
        if (renderTexture !== null) {
          var currentTextureAtlas = currentTextureData.renderTexture;
          if (meshData !== null) {
            var data = meshData.parent.parent;
            var intArray = data.intArray;
            var floatArray = data.floatArray;
            var vertexCount = intArray[meshData.offset + 0 /* MeshVertexCount */ ];
            var triangleCount = intArray[meshData.offset + 1 /* MeshTriangleCount */ ];
            var verticesOffset = intArray[meshData.offset + 2 /* MeshFloatOffset */ ];
            var uvOffset = verticesOffset + vertexCount * 2;
            var meshDisplay = this._renderDisplay;
            var textureAtlasWidth = currentTextureAtlasData.width > 0.0 ? currentTextureAtlasData.width : currentTextureAtlas.width;
            var textureAtlasHeight = currentTextureAtlasData.height > 0.0 ? currentTextureAtlasData.height : currentTextureAtlas.height;
            meshDisplay.vertices = new Float32Array(vertexCount * 2);
            meshDisplay.uvs = new Float32Array(vertexCount * 2);
            meshDisplay.indices = new Uint16Array(triangleCount * 3);
            for (var i = 0, l = vertexCount * 2; i < l; ++i) {
              meshDisplay.vertices[i] = floatArray[verticesOffset + i];
              meshDisplay.uvs[i] = floatArray[uvOffset + i];
            }
            for (var i = 0; i < triangleCount * 3; ++i) {
              meshDisplay.indices[i] = intArray[meshData.offset + 4 /* MeshVertexIndices */ + i];
            }
            for (var i = 0, l = meshDisplay.uvs.length; i < l; i += 2) {
              var u = meshDisplay.uvs[i];
              var v = meshDisplay.uvs[i + 1];
              meshDisplay.uvs[i] = (currentTextureData.region.x + u * currentTextureData.region.width) / textureAtlasWidth;
              meshDisplay.uvs[i + 1] = (currentTextureData.region.y + v * currentTextureData.region.height) / textureAtlasHeight;
            }
            meshDisplay.texture = renderTexture;
            //meshDisplay.dirty = true; // Pixi 3.x
            meshDisplay.dirty++; // Pixi 4.x Can not support change mesh vertice count.
          } else {
            var normalDisplay = this._renderDisplay;
            normalDisplay.texture = renderTexture;
          }
          this._visibleDirty = true;
          return;
        }
      }
      if (meshData !== null) {
        var meshDisplay = this._renderDisplay;
        meshDisplay.texture = null;
        meshDisplay.x = 0.0;
        meshDisplay.y = 0.0;
        meshDisplay.visible = false;
      } else {
        var normalDisplay = this._renderDisplay;
        normalDisplay.texture = null;
        normalDisplay.x = 0.0;
        normalDisplay.y = 0.0;
        normalDisplay.visible = false;
      }
    };

    PhaserSlot.prototype._updateMesh = function() {

      var hasFFD = this._ffdVertices.length > 0;
      var meshData = this._meshData;
      var weight = meshData.weight;
      var meshDisplay = this._renderDisplay;
      if (weight !== null) {
        var data = meshData.parent.parent;
        var intArray = data.intArray;
        var floatArray = data.floatArray;
        var vertexCount = intArray[meshData.offset + 0 /* MeshVertexCount */ ];
        var weightFloatOffset = intArray[weight.offset + 1 /* WeigthFloatOffset */ ];
        for (var i = 0, iD = 0, iB = weight.offset + 2 /* WeigthBoneIndices */ + weight.bones.length, iV = weightFloatOffset, iF = 0; i < vertexCount; ++i) {
          var boneCount = intArray[iB++];
          var xG = 0.0,
            yG = 0.0;
          for (var j = 0; j < boneCount; ++j) {
            var boneIndex = intArray[iB++];
            var bone = this._meshBones[boneIndex];
            if (bone !== null) {
              var matrix = bone.globalTransformMatrix;
              var weight_1 = floatArray[iV++];
              var xL = floatArray[iV++];
              var yL = floatArray[iV++];
              if (hasFFD) {
                xL += this._ffdVertices[iF++];
                yL += this._ffdVertices[iF++];
              }
              xG += (matrix.a * xL + matrix.c * yL + matrix.tx) * weight_1;
              yG += (matrix.b * xL + matrix.d * yL + matrix.ty) * weight_1;
            }
          }
          meshDisplay.vertices[iD++] = xG;
          meshDisplay.vertices[iD++] = yG;
        }
      } else if (hasFFD) {
        var data = meshData.parent.parent;
        var intArray = data.intArray;
        var floatArray = data.floatArray;
        var vertexCount = intArray[meshData.offset + 0 /* MeshVertexCount */ ];
        var vertexOffset = intArray[meshData.offset + 2 /* MeshFloatOffset */ ];
        for (var i = 0, l = vertexCount * 2; i < l; ++i) {
          meshDisplay.vertices[i] = floatArray[vertexOffset + i] + this._ffdVertices[i];
        }
      }
    };


    PhaserSlot.prototype._updateTransform = function(isSkinnedMesh) {
      this._renderDisplay.x = this.global.x;
      this._renderDisplay.y = this.global.y;
      this._renderDisplay.rotation = this.global.skewX;
      this._renderDisplay.scale.x = this.global.scaleX;
      this._renderDisplay.scale.y = this.global.scaleY;
      this._renderDisplay.pivot.x = this._pivotX;
      this._renderDisplay.pivot.y = this._pivotY;

      // throw new Error();
    };

    PhaserSlot.prototype._updateTransformV3 = function(isSkinnedMesh) {
      if (isSkinnedMesh) {
        this._renderDisplay.setTransform(0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0);
      } else {
        this.updateGlobalTransform(); // Update transform.
        var transform = this.global;
        var x = transform.x - (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY);
        var y = transform.y - (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY);
        if (this._renderDisplay === this._rawDisplay || this._renderDisplay === this._meshDisplay) {
          this._renderDisplay.setTransform(x, y, transform.scaleX, transform.scaleY, transform.rotation, transform.skew, 0.0);
        } else {
          this._renderDisplay.position.set(x, y);
          this._renderDisplay.rotation = transform.rotation;
          this._renderDisplay.skew.set(transform.skew, 0.0);
          this._renderDisplay.scale.set(transform.scaleX, transform.scaleY);
        }
      }
    };

    PhaserSlot.prototype._updateTransformV4 = function(isSkinnedMesh) {
      if (isSkinnedMesh) {
        this._renderDisplay.setTransform(0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0);
      } else {
        this.updateGlobalTransform(); // Update transform.
        var transform = this.global;
        if (this._renderDisplay === this._rawDisplay || this._renderDisplay === this._meshDisplay) {
          this._renderDisplay.setTransform(transform.x, transform.y, transform.scaleX, transform.scaleY, transform.rotation, -transform.skew, 0.0, this._pivotX, this._pivotY);
        } else {
          var x = transform.x - (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY);
          var y = transform.y - (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY);
          this._renderDisplay.position.set(x, y);
          this._renderDisplay.rotation = transform.rotation;
          this._renderDisplay.skew.set(-transform.skew, 0.0);
          this._renderDisplay.scale.set(transform.scaleX, transform.scaleY);
        }
      }
    };

    return PhaserSlot;
  }(dragonBones.Slot));
  dragonBones.PhaserSlot = PhaserSlot;

  /**
   * Factory
   */
  var PhaserFactory = (function(_super) {
    __extends(PhaserFactory, _super);

    function PhaserFactory(dataParser, game) {
      if (dataParser === void 0) {
        dataParser = null;
      }
      var _this = _super.call(this, dataParser) || this;
      _this.game = game;
      if (!PhaserFactory._eventManager) {
        PhaserFactory._eventManager = new dragonBones.PhaserArmatureDisplay(game);
        // PixiFactory._dragonBonesInstance = new dragonBones.DragonBones(eventManager);
        PhaserFactory._clock = new dragonBones.WorldClock();
      }
      return _this;
    }

    PhaserFactory._clockHandler = function(passedTime) {
      PhaserFactory._clock.advanceTime(-1); // passedTime !?
    };

    Object.defineProperty(PhaserFactory, "factory", {
      get: function(game) {
        if (!PhaserFactory._factory) {
          PhaserFactory._factory = new PhaserFactory(null, game);
        }
        return PhaserFactory._factory;
      },
      enumerable: true,
      configurable: true
    });

    PhaserFactory.prototype._buildTextureAtlasData = function(textureAtlasData, textureAtlas) {
      if (textureAtlasData) {
        textureAtlasData.texture = textureAtlas;
      } else {
        textureAtlasData = dragonBones.BaseObject.borrowObject(dragonBones.PhaserTextureAtlasData);
      }
      return textureAtlasData;
    };

    PhaserFactory.prototype._buildArmature = function(dataPackage) {
      var armature = dragonBones.BaseObject.borrowObject(dragonBones.Armature);
      var armatureDisplay = new dragonBones.PhaserArmatureDisplay(this.game);
      armature.init(dataPackage.armature, armatureDisplay, armatureDisplay, this._dragonBones);
      return armature;
    };

    PhaserFactory.prototype._buildSlot = function(dataPackage, slotData, displays, armature) {
      //
      // var slot = dragonBones.BaseObject.borrowObject(dragonBones.PhaserSlot);
      // var displayList = [];
      // slot.game = this.game;
      // slot.name = slotData.name;
      // slot._rawDisplay = new Phaser.Sprite(this.game, 0, 0);
      // slot._meshDisplay = null;
      // for (var i = 0, l = displays.length; i < l; ++i) {
      //   var displayData = displays[i];
      //   switch (displayData.type) {
      //     case 0 /* Image */ :
      //       if (!displayData.texture) {
      //         displayData.texture = this._getTextureData(dataPackage.dataName, displayData.name);
      //       }
      //       displayList.push(slot._rawDisplay);
      //       break;
      //     case 2 /* Mesh */ :
      //       if (!displayData.texture) {
      //         displayData.texture = this._getTextureData(dataPackage.dataName, displayData.name);
      //       }
      //       displayList.push(slot._meshDisplay);
      //       break;
      //     case 1 /* Armature */ :
      //       var childArmature = this.buildArmature(displayData.name, dataPackage.dataName);
      //       if (childArmature) {
      //         if (!slot.inheritAnimation) {
      //           var actions = slotData.actions.length > 0 ? slotData.actions : childArmature.armatureData.actions;
      //           if (actions.length > 0) {
      //             for (var i_1 = 0, l_1 = actions.length; i_1 < l_1; ++i_1) {
      //               childArmature._bufferAction(actions[i_1]);
      //             }
      //           } else {
      //             childArmature.animation.play();
      //           }
      //         }
      //         displayData.armature = childArmature.armatureData; //
      //       }
      //       displayList.push(childArmature);
      //       break;
      //     default:
      //       displayList.push(null);
      //       break;
      //   }
      // }
      // slot._setDisplayList(displayList);
      // return slot;

      var slot = dragonBones.BaseObject.borrowObject(dragonBones.PhaserSlot);
      slot.init(slotData, displays, new Phaser.Sprite(this.game, 0, 0)); //, new PIXI.mesh.Mesh(null, null, null, null, PIXI.mesh.Mesh.DRAW_MODES.TRIANGLES)
      return slot;
    };

    /**
     * 创建一个指定名称的骨架。
     * @param armatureName 骨架名称。
     * @param dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，如果多个数据中包含同名的骨架数据，可能无法创建出准确的骨架。
     * @param skinName 皮肤名称，如果未设置，则使用默认皮肤。
     * @param textureAtlasName 贴图集数据名称，如果未设置，则使用龙骨数据。
     * @returns 骨架的显示容器。
     * @see dragonBones.PhaserArmatureDisplay
     */
    PhaserFactory.prototype.buildArmatureDisplay = function(armatureName, dragonBonesName, skinName, textureAtlasName) {
      if (dragonBonesName === void 0) {
        dragonBonesName = null;
      }
      if (skinName === void 0) {
        skinName = null;
      }
      if (textureAtlasName === void 0) {
        textureAtlasName = null;
      }
      var armature = this.buildArmature(armatureName, dragonBonesName, skinName, textureAtlasName);
      if (armature !== null) {
        PhaserFactory._clock.add(armature);
        return armature.display;
      }
      return null;
    };

    /**
     * 获取带有指定贴图的显示对象。
     * @param textureName 指定的贴图名称。
     * @param textureAtlasName 指定的贴图集数据名称，如果未设置，将检索所有的贴图集数据。
     */
    PhaserFactory.prototype.getTextureDisplay = function(textureName, textureAtlasName) {
      if (textureAtlasName === void 0) {
        textureAtlasName = null;
      }
      var textureData = this._getTextureData(textureAtlasName, textureName);
      if (textureData) {
        if (!textureData.texture) {
          var textureAtlasTexture = textureData.parent.texture;
          var originSize = new Phaser.Rectangle(0, 0, textureData.region.width, textureData.region.height);
          textureData.texture = new PIXI.Texture(textureAtlasTexture, textureData.region, originSize);
        }
        return new Phaser.Sprite(this.game, 0, 0, textureData.texture);
      }
      return null;
    };

    Object.defineProperty(PhaserFactory.prototype, "soundEventManater", {
      get: function() {
        return PhaserFactory._eventManager;
      },
      enumerable: true,
      configurable: true
    });

    PhaserFactory._factory = null;
    PhaserFactory._eventManager = null;
    PhaserFactory._clock = null;

    return PhaserFactory;
  }(dragonBones.BaseFactory));
  dragonBones.PhaserFactory = PhaserFactory;

})(dragonBones || (dragonBones = {}));


//plugin
var Rift;
(function(Rift) {
  Rift.IMAGE = 2;
  Rift.JSON = 11;
  Rift.VERSION = "0.1";

  var DragonBonesPlugin = (function(_super) {
    __extends(DragonBonesPlugin, _super);

    function DragonBonesPlugin(game, parent) {
      var _this = _super.call(this, game, parent) || this;
      _this.Suffix = "DragonBonesPlugin";
      _this.ImageSuffix = '_Image_' + _this.Suffix;
      _this.TextureSuffix = '_TextureMap_' + _this.Suffix;
      _this.BonesSuffix = '_Bones_' + _this.Suffix;
      return _this;
    }
    DragonBonesPlugin.prototype.addResourceByNames = function(key, skeletonJson, textureJson, texturePng) {
      this.addResources(key, new Array(new Resource(ResType.Image, texturePng), new Resource(ResType.TextureMap, textureJson), new Resource(ResType.Bones, skeletonJson)));
    };
    DragonBonesPlugin.prototype.addResources = function(key, resources) {
      for (var _i = 0, resources_1 = resources; _i < resources_1.length; _i++) {
        var resource = resources_1[_i];
        this.addResource(key, resource);
      }
    };
    DragonBonesPlugin.prototype.addResource = function(key, res) {
      key = key.toLowerCase();
      var updated = false;
      for (var resKey in DragonBonesPlugin.objDictionary) {
        if (resKey == key) {
          if (DragonBonesPlugin.objDictionary[resKey].resources.filter(function(resource) {
              return resource.type === res.type;
            }).length == 0)
            DragonBonesPlugin.objDictionary[resKey].resources.push(res);
          updated = true;
          break;
        }
      }
      if (!updated) {
        DragonBonesPlugin.objDictionary[key] = new DragonBonesObject(this.game, new Array());
        DragonBonesPlugin.objDictionary[key].resources.push(res);
      }
    };
    DragonBonesPlugin.prototype.loadResources = function() {
      for (var resKey in DragonBonesPlugin.objDictionary) {
        for (var _i = 0, _a = DragonBonesPlugin.objDictionary[resKey].resources; _i < _a.length; _i++) {
          var resource = _a[_i];
          if (resource.loaded)
            continue;
          switch (resource.type) {
            case ResType.Image:
              this.game.load.image(resKey + this.ImageSuffix, resource.filePath);
              break;
            case ResType.TextureMap:
              this.game.load.json(resKey + this.TextureSuffix, resource.filePath);
              break;
            case ResType.Bones:
              this.game.load.json(resKey + this.BonesSuffix, resource.filePath);
              break;
          }
          resource.loaded = true;
        }
      }
    };
    DragonBonesPlugin.prototype.createFactoryItem = function(key) {
      key = key.toLowerCase();
      for (var resKey in DragonBonesPlugin.objDictionary) {
        if (key && resKey != key)
          continue;
        var oItem = DragonBonesPlugin.objDictionary[resKey];
        var item = new DragonBonesObject(this.game, oItem.resources);
        var image = null;
        var texture = null;
        var bones = null;
        for (var i = 0; i < item.resources.length; i++) {
          var res = item.resources[i];
          switch (res.type) {
            case ResType.Image:
              image = this.game.cache.getItem(resKey + this.ImageSuffix, Rift.IMAGE).data;
              break;
            case ResType.TextureMap:
              texture = this.game.cache.getItem(resKey + this.TextureSuffix, Rift.JSON).data;
              break;
            case ResType.Bones:
              bones = this.game.cache.getItem(resKey + this.BonesSuffix, Rift.JSON).data;
              break;
          }
        }
        item.skeleton = item.factory.parseDragonBonesData(bones);
        item.factory.parseTextureAtlasData(texture, image);
        return item;
      }
      return null;
    };
    DragonBonesPlugin.prototype.getArmature = function(key, armatureName) {
      var item = this.createFactoryItem(key);
      if (armatureName == null)
        armatureName = item.skeleton.armatureNames[0];
      var armature = item.factory.buildArmatureDisplay(armatureName);
      item.armature = armature;
      this.refreshClock();
      return item.armature;
    };
    DragonBonesPlugin.prototype.refreshClock = function() {
      var hasEvent = false;
      var callback = dragonBones.PhaserFactory._clockHandler;
      this.game.time.events.events.forEach(function(event, index, events) {
        if (event.callback == callback) {
          hasEvent = true;
          return;
        }
      });
      if (!hasEvent)
        this.game.time.events.loop(20, dragonBones.PhaserFactory._clockHandler, dragonBones.PhaserFactory);
    };
    return DragonBonesPlugin;
  }(Phaser.Plugin));

  DragonBonesPlugin.objDictionary = {};
  Rift.DragonBonesPlugin = DragonBonesPlugin;

  var DragonBonesObject = (function() {
    function DragonBonesObject(game, resources) {
      this.factory = new dragonBones.PhaserFactory(null, game);
      this.resources = resources;
    }
    return DragonBonesObject;
  }());

  var Resource = (function() {
    function Resource(type, filePath) {
      this.loaded = false;
      this.type = type;
      this.filePath = filePath;
    }
    return Resource;
  }());

  Rift.Resource = Resource;

  var ResType;
  (function(ResType) {
    ResType[ResType["Image"] = 0] = "Image";
    ResType[ResType["TextureMap"] = 1] = "TextureMap";
    ResType[ResType["Bones"] = 2] = "Bones";
  })(ResType = Rift.ResType || (Rift.ResType = {}));

})(Rift || (Rift = {}));
