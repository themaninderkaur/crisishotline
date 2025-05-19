package com.example.silverspeedbumps;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.widget.LinearLayout;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class MainActivity extends Activity {
    private GameView gameView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        gameView = new GameView(this);
        setContentView(gameView);
    }

    class GameView extends View {
        private Paint paint;
        private float carX, carY; // Car position
        private List<Cow> cows; // Obstacles
        private Random random;
        private int score;
        private long startTime;
        private boolean gameOver;
        private SharedPreferences prefs;
        private static final int GAME_DURATION = 30000; // 30 seconds
        private static final float CAR_WIDTH = 50, CAR_HEIGHT = 80;
        private static final float COW_SIZE = 40;

        public GameView(Context context) {
            super(context);
            paint = new Paint();
            random = new Random();
            cows = new ArrayList<>();
            prefs = context.getSharedPreferences("SilverSpeedBumps", Context.MODE_PRIVATE);
            resetGame();
        }

        private void resetGame() {
            carX = getWidth() / 2f - CAR_WIDTH / 2; // Center car
            carY = getHeight() - CAR_HEIGHT - 20;
            cows.clear();
            score = 0;
            startTime = System.currentTimeMillis();
            gameOver = false;
            spawnCow();
        }

        private void spawnCow() {
            if (!gameOver) {
                float x = random.nextFloat() * (getWidth() - COW_SIZE);
                cows.add(new Cow(x, -COW_SIZE));
            }
        }

        @Override
        protected void onDraw(Canvas canvas) {
            super.onDraw(canvas);
            // 1950s retro style: black road, white lines, red car
            canvas.drawColor(Color.parseColor("#333333")); // Asphalt
            paint.setColor(Color.WHITE);
            paint.setStrokeWidth(5);
            canvas.drawLine(getWidth() / 3, 0, getWidth() / 3, getHeight(), paint);
            canvas.drawLine(2 * getWidth() / 3, 0, 2 * getWidth() / 3, getHeight(), paint);

            // Draw car (red rectangle)
            paint.setColor(Color.RED);
            canvas.drawRect(carX, carY, carX + CAR_WIDTH, carY + CAR_HEIGHT, paint);

            // Draw cows (white squares)
            paint.setColor(Color.WHITE);
            List<Cow> cowsToRemove = new ArrayList<>();
            for (Cow cow : cows) {
                cow.y += 5; // Move down
                canvas.drawRect(cow.x, cow.y, cow.x + COW_SIZE, cow.y + COW_SIZE, paint);
                // Check collision
                if (cow.y + COW_SIZE > carY && cow.y < carY + CAR_HEIGHT &&
                        cow.x + COW_SIZE > carX && cow.x < carX + CAR_WIDTH) {
                    gameOver = true;
                }
                // Remove off-screen cows, increment score
                if (cow.y > getHeight()) {
                    cowsToRemove.add(cow);
                    score++;
                }
            }
            cows.removeAll(cowsToRemove);

            // Spawn new cow every ~2 seconds
            if (System.currentTimeMillis() - startTime % 2000 < 16) {
                spawnCow();
            }

            // Check game duration
            if (System.currentTimeMillis() - startTime >= GAME_DURATION) {
                gameOver = true;
            }

            // Draw score
            paint.setColor(Color.YELLOW);
            paint.setTextSize(40);
            canvas.drawText("Score: " + score, 20, 50, paint);

            if (gameOver) {
                showResults();
            } else {
                invalidate(); // Redraw
            }
        }

        @Override
        public boolean onTouchEvent(MotionEvent event) {
            if (event.getAction() == MotionEvent.ACTION_DOWN && !gameOver) {
                // Move car to left or right lane
                float touchX = event.getX();
                if (touchX < getWidth() / 2) {
                    carX = getWidth() / 3 - CAR_WIDTH / 2; // Left lane
                } else {
                    carX = 2 * getWidth() / 3 - CAR_WIDTH / 2; // Right lane
                }
                invalidate();
            }
            return true;
        }

        private void showResults() {
            // Save high score
            int highScore = prefs.getInt("highScore", 0);
            if (score > highScore) {
                prefs.edit().putInt("highScore", score).apply();
                highScore = score;
            }

            // Humorous feedback based on score
            String message;
            if (score < 5) {
                message = "Yikes, Pops! Those cows owned you! Maybe try the bus? Get a free coffee with Lyft!";
            } else if (score < 10) {
                message = "Not bad, but those reflexes need a tune-up! Call your grandkid for a ride.";
            } else {
                message = "Rockin' it like it's 1955! Still, why not relax and let Uber take the wheel?";
            }

            new AlertDialog.Builder(getContext())
                    .setTitle("Game Over!")
                    .setMessage("Score: " + score + "\nHigh Score: " + highScore + "\n\n" + message)
                    .setPositiveButton("Play Again", (dialog, which) -> resetGame())
                    .setNegativeButton("Quit", (dialog, which) -> ((Activity) getContext()).finish())
                    .setCancelable(false)
                    .show();
        }
    }

    static class Cow {
        float x, y;
        Cow(float x, float y) {
            this.x = x;
            this.y = y;
        }
    }
}
