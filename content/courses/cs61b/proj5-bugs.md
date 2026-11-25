# 项目 5：常见问题

> 本页是 UC Berkeley CS61B 2026 春季官方项目说明「Common Bugs」的中文翻译，原文见 https://sp26.datastructur.es/proj5/bugs/。命令、代码和程序输出保持原样。

## 截止时间

注意：本项目有 **3 个截止时间**，有的截止时间还要求提交**多份材料**。请务必反复确认每一样都已提交！

| 条目 | 任务 | 提交物 | 分值 | 截止时间 |
| --- | --- | --- | --- | --- |
| 项目 5A | 组队；环境配置；设计文档 | 在 Beacon 上完成组队 | 10 | 4 月 10 日（周五）太平洋时间 23:59 |
| 同上 | | 设计文档 | 50 | 4 月 15 日（周三）太平洋时间 23:59 |
| 项目 5B | 世界生成 | 在 **Gradescope** 上提交世界截图 | 40 | 4 月 21 日（周二）太平洋时间 23:59 |
| 项目 5C | 任务 1：主菜单；任务 2：交互；任务 3：HUD；任务 4：保存与加载；任务 5：寻路；任务 6：进阶功能 | 在 **Gradescope** 上提交代码 | 150 | 4 月 28 日（周二）太平洋时间 23:59 |
| **与助教现场验收**（在 4/27–5/1 期间进行） | | | 170 | |

要在项目 5 上申请延期，**两位搭档**需要在 Beacon 上分别提交各自的延期申请。

## 常见 Bug

### 重写 equals

**问题**：我的类的两个实例明明应该相等，却被告知不相等。而且我把这个类的实例作为键（key）放进 HashMap，之后却查不到它。

**解决**：如果你创建了自己的类，务必同时重写 `.equals()` 方法和 `.hashCode()` 方法。这能保证两个相等的实例拥有相同的哈希码。

> **译注**：Java 中该方法名为 `hashCode`（原文误作 `hashcode`），译文已更正。

### 常见界面问题

#### 文字不显示

让文字在屏幕上显示出来其实有点讲究，有几件事必须做对：

- 字体颜色必须设成看得见的颜色（例如白色）
- 文字的位置必须在窗口范围内
- 画完文字后必须调用 `StdDraw.show()`，它才会出现在屏幕上
- 必须确保你的文字画出来之后不会马上被覆盖或清掉（例如，`TERenderer.renderTiles` 会清空整个屏幕）

下面这段代码应该能正确地画出文字：

```
TERenderer ter = new TERenderer();
ter.initialize(80, 40, 0, 0);
StdDraw.setPenColor(Color.WHITE);
StdDraw.text(40, 30, "I like cheese");
StdDraw.show();
```

（这段代码会先初始化渲染器，把画笔设为白色，在坐标 (40, 30) 处画出文字 `I like cheese`，再把它显示到屏幕上。）

#### 瓦片显示异常

**问题**：一个常见的毛病是，实现了其他界面部分之后，瓦片的字符会突然变得不正常。下面这个程序演示了这个问题：

```
package core;

import edu.princeton.cs.algs4.StdDraw;
import tileengine.TERenderer;
import tileengine.TETile;
import tileengine.Tileset;

import java.awt.*;
import java.util.Arrays;

public class FlowerWorld {
    public static final int WORLD_WIDTH = 80;
    public static final int WORLD_HEIGHT = 40;

    public static void main(String[] args) {
        // create renderer
        TERenderer ter = new TERenderer();
        ter.initialize(WORLD_WIDTH, WORLD_HEIGHT, 0, 0);

        // draw main menu
        StdDraw.setFont(new Font("Monaco", Font.BOLD, 50));
        StdDraw.setPenColor(Color.WHITE);
        StdDraw.text(WORLD_WIDTH * 0.5, WORLD_HEIGHT * 0.75, "Press any key to continue");
        StdDraw.show();
        while (!StdDraw.hasNextKeyTyped()) {
            StdDraw.pause(10);
        }

        // create flower world
        TETile[][] tiles = new TETile[WORLD_WIDTH][WORLD_HEIGHT];
        for (TETile[] ar : tiles) {
            Arrays.fill(ar, Tileset.NOTHING);
        }
        for (int x = WORLD_WIDTH / 4; x < WORLD_WIDTH * 3 / 4; x++) {
            for (int y = WORLD_HEIGHT / 4; y < WORLD_HEIGHT * 3 / 4; y++) {
                tiles[x][y] = Tileset.FLOWER;
            }
        }

        // render frame
        StdDraw.clear(new Color(0, 0, 0));
        ter.drawTiles(tiles);
        StdDraw.show();
        StdDraw.pause(10);
    }
}
```

你会注意到，花看起来不再像花了。这是因为（主菜单那段代码里）字体设得太大了，每个瓦片的字符都溢出到了旁边的瓦片上。

**解决**：问题在于画瓦片时用的字体太大，所以我们要用一个重置字体大小的方法。在你的 `TERenderer` 类里加上 `resetFont` 方法：

```
/** Sets the font to the correct font for drawing tiles */
public void resetFont() {
    Font font = new Font("Monaco", Font.BOLD, TILE_SIZE - 2);
    StdDraw.setFont(font);
}
```

（方法上方的注释意思是「把字体设为画瓦片用的正确字体」。）

然后，在画瓦片之前调用这个方法。原来的代码：

```
// render frame
StdDraw.clear(new Color(0, 0, 0));
ter.drawTiles(tiles);
StdDraw.show();
StdDraw.pause(10);
```

改为：

```
// render frame
ter.resetFont();
StdDraw.clear(new Color(0, 0, 0));
ter.drawTiles(tiles);
StdDraw.show();
StdDraw.pause(10);
```

现在再运行 `FlowerWorld`，瓦片应该就能正确地画出来了。

#### 自定义图片不显示

**问题**：如果你在为游戏制作自定义图片，可能会遇到一个 bug：即使你已经用正确的文件路径创建了自定义 TETile，图片还是显示不出来。

**解决**：确保你的图片是 16x16 像素、以 PNG 格式保存的。
